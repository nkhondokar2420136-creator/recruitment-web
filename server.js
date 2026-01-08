require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query, testConnection } = require('../db.cjs');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

testConnection();

// --- AUTH ---
app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    try {
        // Use parameterized query
        const users = await query(
            'SELECT UserID AS "UserID", Username AS "Username", RoleID AS "RoleID" FROM Users WHERE Username = $1 AND IsActive = true', 
            [username]
        );
        if (users.length > 0) res.json(users[0]);
        else res.status(401).json({ error: "Invalid credentials" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN ---
app.get('/api/admin/analytics/funnel', async (req, res) => {
    try { 
        res.json(await query("SELECT * FROM vw_ApplicationFunnel")); 
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Audit Logs
app.get('/api/admin/audit-logs', async (req, res) => {
    try {
        // Changed TOP to LIMIT for PostgreSQL
        const data = await query(
            "SELECT * FROM AuditLog ORDER BY ChangedAt DESC LIMIT 20"
        );
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 1. Fetch all users for management
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await query(
            "SELECT UserID, Username, RoleID, IsActive FROM Users ORDER BY RoleID ASC, Username ASC"
        );
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Toggle User Active Status (Deactivate/Activate)
app.put('/api/admin/users/:userId/toggle', async (req, res) => {
    try {
        // PostgreSQL doesn't need parameterized query for simple integer
        await query(
            `UPDATE Users SET IsActive = NOT IsActive WHERE UserID = $1`,
            [req.params.userId]
        );
        res.json({ message: "User status updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Generic Report Route for the 14+ Views in Flowchart
app.get('/api/admin/reports/:viewName', async (req, res) => {
    const { viewName } = req.params;
    const allowed = [
        'vw_CandidateMatchScore', 'vw_TimeToHire', 'vw_AverageTimeToHire', 
        'vw_HireRatePerJob', 'vw_RecruiterPerformance', 'vw_ApplicationFunnel',
        'vw_Bias_Location', 'vw_Bias_Experience', 'vw_InterviewScoreVsDecision',
        'vw_InterviewerConsistency', 'vw_SkillGapAnalysis', 'vw_CandidateEngagement',
        'vw_HiringBottlenecks', 'vw_RejectionAnalysis', 'vw_VacancyUtilization', 'vw_SilentRejections'
    ];

    if (!allowed.includes(viewName)) return res.status(403).json({ error: "Invalid View" });

    try {
        const results = await query(`SELECT * FROM ${viewName}`);
        res.json(results);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. System Maintenance Actions
app.post('/api/admin/maintenance', async (req, res) => {
    const { procedure } = req.body;
    const allowedProcs = ['sp_ArchiveOldData', 'sp_AnonymizeArchivedCandidates', 'sp_AutoRejectUnqualified'];

    if (!allowedProcs.includes(procedure)) return res.status(403).json({ error: "Invalid Procedure" });

    try {
        // PostgreSQL doesn't need SET NOCOUNT ON
        // Use SELECT for functions that return void
        await query(`SELECT ${procedure}()`);
        
        res.json({ 
            success: true, 
            message: `${procedure} executed successfully.` 
        });
    } catch (err) { 
        console.error(`Maintenance Error (${procedure}):`, err.message);
        res.status(500).json({ error: err.message }); 
    }
});

app.post('/api/admin/users/candidate', async (req, res) => {
    const { username, email, password, fullName, location, yearsOfExperience } = req.body;

    try {
        // Use parameterized queries to prevent SQL injection
        const userResult = await query(`
            INSERT INTO Users (Username, Email, PasswordHash, RoleID, IsActive)
            VALUES ($1, $2, $3, 3, TRUE)
            RETURNING UserID
        `, [username, email, password]);

        const newUserId = userResult[0].userid; // Note: PostgreSQL returns lowercase column names

        // Step B: Use that ID to create the Candidate Profile
        await query(`
            INSERT INTO Candidates (UserID, FullName, Location, YearsOfExperience)
            VALUES ($1, $2, $3, $4)
        `, [newUserId, fullName, location || 'N/A', yearsOfExperience || 0]);

        res.json({ success: true, message: "User and Candidate Profile created successfully." });
    } catch (err) {
        console.error("Creation Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/jobs', async (req, res) => {
    try { 
        res.json(await query("SELECT * FROM JobPostings WHERE IsDeleted = FALSE")); 
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Get all Candidates with their User info
app.get('/api/admin/candidates', async (req, res) => {
    try { 
        res.json(await query(
            "SELECT c.*, u.Email, u.Username FROM Candidates c JOIN Users u ON c.UserID = u.UserID"
        )); 
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. Get Applications with Joins (Essential for readability)
app.get('/api/admin/applications-detailed', async (req, res) => {
    const sql = `
        SELECT a.ApplicationID, c.FullName, j.JobTitle, s.StatusName, a.AppliedDate 
        FROM Applications a
        JOIN Candidates c ON a.CandidateID = c.CandidateID
        JOIN JobPostings j ON a.JobID = j.JobID
        JOIN ApplicationStatus s ON a.StatusID = s.StatusID
        WHERE a.IsDeleted = FALSE`;
    try { res.json(await query(sql)); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// GET: Fetch all skills
app.get('/api/admin/skills', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
        const result = await query("SELECT SkillID, SkillName FROM Skills ORDER BY SkillName ASC");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Add a new skill
app.post('/api/admin/skills', async (req, res) => {
    const { SkillName } = req.body;

    if (!SkillName || typeof SkillName !== 'string') {
        return res.status(400).json({ error: "Valid Skill Name is required" });
    }

    try {
        // Use parameterized query
        await query(`INSERT INTO Skills (SkillName) VALUES ($1)`, [SkillName.trim()]);
        
        res.status(201).json({ success: true, message: "Skill added" });
    } catch (err) {
        console.error("POST Skills Error:", err);
        
        // Check for UNIQUE constraint violation
        if (err.message.includes('duplicate key') || err.code === '23505') {
            return res.status(400).json({ error: "This skill already exists!" });
        }
        
        res.status(500).json({ error: err.message });
    }
});

// Fetch Job Postings Archive
app.get('/api/admin/archives/jobs', async (req, res) => {
    try {
        const data = await query("SELECT * FROM JobPostingsArchive ORDER BY ArchivedAt DESC");
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fetch Applications Archive (with Joins for readability)
app.get('/api/admin/archives/applications', async (req, res) => {
    try {
        const sql = `
            SELECT aa.*, c.FullName, j.JobTitle, s.StatusName
            FROM ApplicationsArchive aa
            LEFT JOIN Candidates c ON aa.CandidateID = c.CandidateID
            LEFT JOIN JobPostings j ON aa.JobID = j.JobID
            LEFT JOIN ApplicationStatus s ON aa.StatusID = s.StatusID
            ORDER BY aa.ArchivedAt DESC`;
        const data = await query(sql);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- RECRUITER (Aligned with your JobPostings table) ---
app.get('/api/recruiter/jobs/:userId', async (req, res) => {
    try {
        const results = await query(`
            SELECT * FROM JobPostings 
            WHERE IsDeleted = FALSE 
            ORDER BY CreatedAt DESC
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/recruiter/jobs', async (req, res) => {
    const { title, description, location, minExp, vacancies, userId, requirements } = req.body;
    
    try {
        // Use parameterized query with RETURNING clause
        const result = await query(`
            INSERT INTO JobPostings (JobTitle, Description, Location, MinExperience, Vacancies, CreatedBy)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING JobID
        `, [title, description, location, minExp, vacancies, userId]);

        const newJobId = result[0].jobid; // lowercase in PostgreSQL

        if (requirements && requirements.length > 0) {
            for (const skill of requirements) {
                await query(`
                    INSERT INTO JobSkills (JobID, SkillID, IsMandatory, MinProficiency)
                    VALUES ($1, $2, $3, $4)
                `, [newJobId, skill.skillId, skill.isMandatory || false, skill.minProficiency || 1]);
            }
        }

        res.json({ message: "Job and Skills Published Successfully" });
    } catch (err) { 
        console.error(err);
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/recruiter/matches/:jobId', async (req, res) => {
    const { jobId } = req.params;

    // PostgreSQL JSON functions are different
    const sql = `
        SELECT 
            a.ApplicationID,
            v.CandidateID,
            v.FullName,
            v.TotalMatchScore,
            v.ExperienceScore,
            v.LocationBonus,
            ast.StatusName,
            a.StatusID,
            COALESCE((
                SELECT json_agg(json_build_object(
                    'SkillName', s.SkillName,
                    'RequiredLevel', js.MinProficiency,
                    'CandidateLevel', COALESCE(cs.ProficiencyLevel, 0),
                    'IsMandatory', js.IsMandatory
                ))
                FROM JobSkills js
                JOIN Skills s ON js.SkillID = s.SkillID
                LEFT JOIN CandidateSkills cs ON js.SkillID = cs.SkillID 
                     AND cs.CandidateID = v.CandidateID
                WHERE js.JobID = $1
            ), '[]'::json) AS SkillsDetails
        FROM vw_CandidateMatchScore v
        JOIN Applications a ON v.CandidateID = a.CandidateID AND v.JobID = a.JobID
        JOIN ApplicationStatus ast ON a.StatusID = ast.StatusID
        WHERE v.JobID = $1
        ORDER BY v.TotalMatchScore DESC
    `;

    try {
        const results = await query(sql, [jobId]);
        // No need to parse JSON, PostgreSQL returns it as JSON
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch matches." });
    }
});

app.delete('/api/recruiter/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        await query(`
            UPDATE JobPostings 
            SET IsDeleted = TRUE, IsActive = FALSE 
            WHERE JobID = $1
        `, [jobId]);
        res.json({ message: "Job posting moved to trash (Soft Deleted)." });
    } catch (err) {
        res.status(500).json({ error: "Failed to soft delete: " + err.message });
    }
});

// 1. Fetch only soft-deleted jobs
app.get('/api/recruiter/jobs/archived/:userId', async (req, res) => {
    try {
        const results = await query(
            `SELECT * FROM JobPostings WHERE IsDeleted = TRUE ORDER BY CreatedAt DESC`
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Restore a soft-deleted job
app.put('/api/recruiter/jobs/restore/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        await query(
            `UPDATE JobPostings SET IsDeleted = FALSE, IsActive = TRUE WHERE JobID = $1`,
            [jobId]
        );
        res.json({ message: "Job restored successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/recruiter/hire', async (req, res) => {
    const { applicationId, userId } = req.body;

    try {
        // 1. Get the RecruiterID for the logged-in User
        const recruiterData = await query(
            `SELECT RecruiterID FROM Recruiters WHERE UserID = $1`,
            [userId]
        );

        if (recruiterData.length === 0) {
            return res.status(403).json({ error: "User is not a registered recruiter." });
        }

        const recruiterId = recruiterData[0].recruiterid;

        // 2. Execute the function (no EXEC in PostgreSQL)
        await query(`SELECT sp_HireCandidate($1, $2)`, [applicationId, recruiterId]);

        res.json({ success: true, message: "Candidate successfully hired! Vacancies updated." });
    } catch (err) {
        console.error("Hiring Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// --- STATE MACHINE: UPDATE APPLICATION STATUS ---
app.put('/api/recruiter/applications/:appId/status', async (req, res) => {
    const { appId } = req.params;
    const { newStatusId, userId, notes } = req.body;

    try {
        const cleanAppId = Number(appId);
        const cleanStatusId = Number(newStatusId);

        if (isNaN(cleanAppId) || isNaN(cleanStatusId)) {
            return res.status(400).json({ error: "Invalid Application or Status ID." });
        }

        const recruiterData = await query(
            `SELECT RecruiterID FROM Recruiters WHERE UserID = $1`, 
            [Number(userId)]
        );
        if (recruiterData.length === 0) return res.status(403).json({ error: "Not authorized." });

        const recruiterId = recruiterData[0].recruiterid;

        // Call the PostgreSQL function
        await query(`
            SELECT sp_UpdateApplicationStatus($1, $2, $3, $4)
        `, [cleanAppId, cleanStatusId, recruiterId, notes || '']);

        res.json({ success: true, message: "Status updated successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/recruiter/interviews', async (req, res) => {
    const { applicationId, recruiterUserId, startTime, endTime } = req.body;

    try {
        // Call the PostgreSQL function
        await query(`
            SELECT sp_ScheduleInterviewWithRecruiter($1, $2, $3, $4)
        `, [applicationId, recruiterUserId, startTime, endTime]);

        res.json({ success: true, message: "Interview scheduled! Notification queued." });
    } catch (err) {
        console.error("Schedule Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/recruiter/run-auto-reject', async (req, res) => {
    try {
        await query("SELECT sp_AutoRejectUnqualified()");
        
        res.json({ 
            success: true, 
            message: "Real-time triggers are active. Manual cleanup of existing data complete." 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/recruiter/summary/:userId', async (req, res) => {
    try {
        const stats = await query(`
            SELECT 
                (SELECT COUNT(*) FROM JobPostings WHERE CreatedBy = $1 AND IsDeleted = FALSE) as ActiveJobs,
                (SELECT COUNT(*) FROM Applications a 
                 JOIN JobPostings jp ON a.JobID = jp.JobID 
                 WHERE jp.CreatedBy = $1 AND a.StatusID = 1) as NewApplications,
                (SELECT COUNT(*) FROM InterviewSchedules i 
                 JOIN Recruiters r ON i.RecruiterID = r.RecruiterID
                 WHERE r.UserID = $1 
                 AND DATE(i.InterviewStart) = CURRENT_DATE) as InterviewsToday
        `, [req.params.userId]);
        
        res.json(stats[0] || { activejobs: 0, newapplications: 0, interviewstoday: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/recruiter/schedule/today/:userId', async (req, res) => {
    try {
        const schedule = await query(`
            SELECT 
                i.InterviewID,
                i.InterviewStart,
                i.InterviewEnd,
                c.FullName as CandidateName,
                jp.JobTitle,
                a.ApplicationID
            FROM InterviewSchedules i
            JOIN Recruiters r ON i.RecruiterID = r.RecruiterID
            JOIN Applications a ON i.ApplicationID = a.ApplicationID
            JOIN Candidates c ON a.CandidateID = c.CandidateID
            JOIN JobPostings jp ON a.JobID = jp.JobID
            WHERE r.UserID = $1
            AND DATE(i.InterviewStart) = CURRENT_DATE
            ORDER BY i.InterviewStart ASC
        `, [req.params.userId]);
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CANDIDATE & SHARED ---
app.get('/api/jobs', async (req, res) => {
    try { 
        res.json(await query(
            "SELECT * FROM JobPostings WHERE IsActive = TRUE AND IsDeleted = FALSE"
        )); 
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/skills', async (req, res) => {
    try { 
        res.json(await query("SELECT * FROM Skills ORDER BY SkillName")); 
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/candidate/profile/:userId', async (req, res) => {
    try {
        const profile = await query(
            `SELECT * FROM Candidates WHERE UserID = $1`,
            [req.params.userId]
        );
        const skills = await query(`
            SELECT s.SkillID, s.SkillName, cs.ProficiencyLevel 
            FROM CandidateSkills cs 
            JOIN Skills s ON cs.SkillID = s.SkillID 
            WHERE cs.CandidateID = (SELECT CandidateID FROM Candidates WHERE UserID = $1)
        `, [req.params.userId]);
        res.json({ ...profile[0], skills });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/candidate/profile', async (req, res) => {
    const { userId, location, yearsOfExperience } = req.body;
    try {
        await query(`
            UPDATE Candidates 
            SET Location = $1, YearsOfExperience = $2 
            WHERE UserID = $3
        `, [location, yearsOfExperience, userId]);
        res.json({ message: "Profile updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/candidate/skills', async (req, res) => {
    const { userId, skillId, proficiency } = req.body;
    try {
        const cand = await query(
            `SELECT CandidateID FROM Candidates WHERE UserID = $1`,
            [userId]
        );
        const cid = cand[0].candidateid;
        
        // Upsert logic for skills - PostgreSQL syntax
        await query(`
            INSERT INTO CandidateSkills (CandidateID, SkillID, ProficiencyLevel)
            VALUES ($1, $2, $3)
            ON CONFLICT (CandidateID, SkillID) 
            DO UPDATE SET ProficiencyLevel = EXCLUDED.ProficiencyLevel
        `, [cid, skillId, proficiency]);
        
        res.json({ message: "Skill updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/apply', async (req, res) => {
    const { jobId, userId } = req.body;
    try {
        const cand = await query(
            `SELECT CandidateID FROM Candidates WHERE UserID = $1`,
            [userId]
        );
        await query(
            `INSERT INTO Applications (JobID, CandidateID, StatusID) VALUES ($1, $2, 1)`,
            [jobId, cand[0].candidateid]
        );
        res.json({ message: "Applied Successfully!" });
    } catch (err) { 
        res.status(500).json({ error: "Already applied or DB error." }); 
    }
});

app.get('/api/candidate/apps/:userId', async (req, res) => {
    try {
        const data = await query(`
            SELECT a.ApplicationID, a.JobID, j.JobTitle, s.StatusName, a.AppliedDate 
            FROM Applications a 
            JOIN JobPostings j ON a.JobID = j.JobID 
            JOIN ApplicationStatus s ON a.StatusID = s.StatusID
            WHERE a.CandidateID = (SELECT CandidateID FROM Candidates WHERE UserID = $1)
            AND a.IsDeleted = FALSE
        `, [req.params.userId]);
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/withdraw', async (req, res) => {
    const { appId, userId } = req.body;
    try {
        const cand = await query(
            `SELECT CandidateID FROM Candidates WHERE UserID = $1`,
            [userId]
        );
        const cid = cand[0].candidateid;

        // PostgreSQL doesn't need SET NOCOUNT ON
        await query(`SELECT sp_WithdrawApplication($1, $2, 'User Withdrawn')`, [appId, cid]);
        
        res.json({ success: true, message: "Withdrawn successfully" });
    } catch (err) { 
        console.error("Withdraw error:", err.message);
        res.status(400).json({ error: err.message }); 
    }
});

// 1. Get Job Recommendations with Match Scores
app.get('/api/candidate/recommendations/:userId', async (req, res) => {
    try {
        const sql = `
            SELECT j.*, v.TotalMatchScore 
            FROM JobPostings j
            CROSS JOIN (SELECT CandidateID FROM Candidates WHERE UserID = $1) c
            LEFT JOIN vw_CandidateMatchScore v ON v.JobID = j.JobID AND v.CandidateID = c.CandidateID
            WHERE j.IsActive = TRUE AND j.IsDeleted = FALSE
            ORDER BY COALESCE(v.TotalMatchScore, 0) DESC`;
        const results = await query(sql, [req.params.userId]);
        res.json(results);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Manage Documents (Fetching)
app.get('/api/candidate/documents/:userId', async (req, res) => {
    try {
        const cand = await query(
            `SELECT CandidateID FROM Candidates WHERE UserID = $1`,
            [req.params.userId]
        );
        const docs = await query(
            `SELECT * FROM CandidateDocuments WHERE CandidateID = $1`,
            [cand[0].candidateid]
        );
        res.json(docs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/candidate/skill-gap/:jobId/:userId', async (req, res) => {
    const { jobId, userId } = req.params;
    try {
        const sql = `
            SELECT 
                s.SkillName,
                js.MinProficiency AS RequiredLevel,
                js.IsMandatory,
                COALESCE(cs.ProficiencyLevel, 0) AS CandidateLevel,
                CASE 
                    WHEN COALESCE(cs.ProficiencyLevel, 0) >= js.MinProficiency THEN 'Met'
                    WHEN COALESCE(cs.ProficiencyLevel, 0) > 0 THEN 'Improve'
                    ELSE 'Missing'
                END AS Status
            FROM JobSkills js
            JOIN Skills s ON js.SkillID = s.SkillID
            LEFT JOIN CandidateSkills cs ON js.SkillID = cs.SkillID 
                AND cs.CandidateID = (SELECT CandidateID FROM Candidates WHERE UserID = $2)
            WHERE js.JobID = $1
        `;
        const gapData = await query(sql, [jobId, userId]);
        res.json(gapData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Get all scheduled interviews for a candidate
app.get('/api/candidate/interviews/:userId', async (req, res) => {
    try {
        const sql = `
            SELECT * FROM vw_CandidateInterviews 
            WHERE UserID = $1 
            ORDER BY InterviewStart ASC
        `;
        const data = await query(sql, [req.params.userId]);
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 2. Confirm an interview (BIT update)
app.put('/api/candidate/interviews/confirm', async (req, res) => {
    const { scheduleId, userId } = req.body;

    try {
        const sId = Number(scheduleId);
        const uId = Number(userId);

        if (!sId || !uId) {
            return res.status(400).json({ error: "Missing Schedule or User information." });
        }

        // Call the function that returns a table
        const result = await query(`SELECT * FROM sp_ConfirmInterview($1, $2)`, [sId, uId]);
        
        res.json({ success: true, message: "Interview confirmed!", data: result[0] });
    } catch (err) {
        console.error("Confirmation Error:", err.message);
        res.status(403).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;