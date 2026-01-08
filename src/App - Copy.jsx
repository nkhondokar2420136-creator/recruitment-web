import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, BarChart3, Settings, LogOut, X,
  Search, Clock, ShieldAlert, ChevronRight, CheckCircle, Trash2, UserCircle, Plus, Star, FileText, Calendar, BriefcaseBusiness, AlertCircle, UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [user, setUser] = useState(null); 
  const [usernameInput, setUsernameInput] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, { username: usernameInput });
      setUser(res.data);
    } catch (err) { alert("Login Failed."); }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8 tracking-tight italic">RECRUIT<span className="text-blue-600">DB</span></h1>
          <input type="text" required placeholder="Username" className="w-full p-3 bg-gray-50 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-500" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2"><Briefcase className="text-blue-600"/><span className="font-bold text-xl tracking-tighter uppercase italic">RecruitPro</span></div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold">{user.Username}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase">{user.RoleID === 1 ? 'Admin' : user.RoleID === 2 ? 'Recruiter' : 'Candidate'}</p>
          </div>
          <button onClick={() => setUser(null)} className="text-gray-400 hover:text-red-600"><LogOut size={20}/></button>
        </div>
      </nav>
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {user.RoleID === 1 && <AdminDashboard />}
        {user.RoleID === 2 && <RecruiterDashboard user={user} />}
        {user.RoleID === 3 && <CandidateDashboard user={user} />}
      </main>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard() {
  const [funnelData, setFunnelData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  useEffect(() => {
    axios.get(`${API_BASE}/admin/analytics/funnel`).then(res => setFunnelData(res.data));
    axios.get(`${API_BASE}/admin/audit-logs`).then(res => setAuditLogs(res.data));
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black">Admin Console</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 mb-8 uppercase">Application Funnel</h3>
          <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={funnelData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="StatusName"/><YAxis/><Tooltip/><Bar dataKey="ApplicationCount" fill="#2563eb" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase">Database Views Active</h3>
          {['vw_SkillGapAnalysis', 'vw_Bias_Location', 'vw_HireRatePerJob', 'vw_TimeToHire'].map(v => (<div key={v} className="p-3 mb-2 bg-gray-50 rounded-xl text-[10px] font-mono font-bold text-slate-500">{v}</div>))}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400"><tr><th className="px-6 py-3">Table</th><th className="px-6 py-3">Changes</th><th className="px-6 py-3">Time</th></tr></thead>
          <tbody className="divide-y">{auditLogs.map((log, i) => (<tr key={i} className="text-sm"><td className="px-6 py-4 font-bold">{log.TableName}</td><td className="px-6 py-4">{log.OldValue} → {log.NewValue}</td><td className="px-6 py-4 text-gray-400">{new Date(log.ChangedAt).toLocaleString()}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// --- RECRUITER DASHBOARD (UPDATED WITH INTERVIEW SCHEDULING) ---
function RecruiterDashboard({ user }) {
  const [matches, setMatches] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); 
  
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Scheduling States
  const [schedStart, setSchedStart] = useState("");
  const [schedEnd, setSchedEnd] = useState("");

  const [newJob, setNewJob] = useState({ 
    title: '', description: '', location: '', minExp: 0, vacancies: 1, requirements: [] 
  });

  const fetchData = async () => {
    try {
      const [activeRes, archivedRes, skillsRes] = await Promise.all([
        axios.get(`${API_BASE}/recruiter/jobs/${user.UserID}`),
        axios.get(`${API_BASE}/recruiter/jobs/archived/${user.UserID}`),
        axios.get(`${API_BASE}/skills`)
      ]);
      setMyJobs(activeRes.data);
      setArchivedJobs(archivedRes.data);
      setAvailableSkills(skillsRes.data);
      if (activeRes.data.length > 0 && !selectedJob) {
        setSelectedJob(activeRes.data[0]);
      }
    } catch (err) { console.error("Data fetch error", err); }
  };

  const loadMatches = (jobId) => {
    axios.get(`${API_BASE}/recruiter/matches/${jobId}`)
      .then(res => setMatches(res.data))
      .catch(() => setMatches([]));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (selectedJob) {
      loadMatches(selectedJob.JobID);
    }
  }, [selectedJob]);

  const handleStatusUpdate = async (applicationId, newStatusId, statusLabel) => {
    try {
        const res = await axios.put(`${API_BASE}/recruiter/applications/${applicationId}/status`, {
            newStatusId,
            userId: user.UserID,
            notes: `Candidate moved to ${statusLabel} via Dashboard.`
        });
        alert(res.data.message);
        setShowMatchModal(false);
        if (selectedJob) loadMatches(selectedJob.JobID);
    } catch (err) {
        alert("Status Update Failed: " + (err.response?.data?.error || "Invalid transition."));
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    // Format the strings to be SQL Server friendly
    // Converts "2026-01-20T14:30" to "2026-01-20 14:30:00"
    const formattedStart = schedStart.replace('T', ' ') + ":00";
    const formattedEnd = schedEnd.replace('T', ' ') + ":00";

    try {
        const response = await axios.post(`${API_BASE}/recruiter/interviews`, {
            applicationId: selectedMatch.ApplicationID,
            recruiterUserId: user.UserID,
            startTime: formattedStart,
            endTime: formattedEnd
        });
        alert(response.data.message);
        setSchedStart("");
        setSchedEnd("");
        setShowMatchModal(false); // Close modal on success
    } catch (err) {
        alert("Scheduling Error: " + (err.response?.data?.error || "Check recruiter availability."));
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/recruiter/jobs`, { ...newJob, userId: user.UserID });
      setShowForm(false);
      setNewJob({ title: '', description: '', location: '', minExp: 0, vacancies: 1, requirements: [] });
      fetchData();
      alert("Job Published!");
    } catch (err) { alert("Error: " + (err.response?.data?.error || "Check database.")); }
  };

  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation();
    if (!window.confirm("Archive this job?")) return;
    try {
        await axios.delete(`${API_BASE}/recruiter/jobs/${jobId}`);
        if (selectedJob?.JobID === jobId) setSelectedJob(null);
        fetchData();
    } catch (err) { alert("Error archiving job."); }
  };

  const handleRestoreJob = async (jobId, e) => {
    e.stopPropagation();
    try {
        await axios.put(`${API_BASE}/recruiter/jobs/restore/${jobId}`);
        fetchData();
    } catch (err) { alert("Error restoring job."); }
  };

  const handleHireCandidate = async (applicationId) => {
    if(!window.confirm("Confirm hiring? This will decrement vacancies and record the status change.")) return;
    try {
      const res = await axios.post(`${API_BASE}/recruiter/hire`, {
        applicationId: applicationId,
        userId: user.UserID
      });
      alert(res.data.message);
      setShowMatchModal(false);
      fetchData(); 
      if(selectedJob) loadMatches(selectedJob.JobID); 
    } catch (err) {
      alert("Hiring Failed: " + (err.response?.data?.error || "Server Error"));
    }
  };

  const toggleSkill = (skillId) => {
    const exists = newJob.requirements.find(r => r.skillId === skillId);
    if (exists) {
      setNewJob({ ...newJob, requirements: newJob.requirements.filter(r => r.skillId !== skillId) });
    } else {
      setNewJob({ ...newJob, requirements: [...newJob.requirements, { skillId, minProficiency: 5, isMandatory: false }] });
    }
  };

  const updateSkillReq = (skillId, field, value) => {
    const updated = newJob.requirements.map(r => r.skillId === skillId ? { ...r, [field]: value } : r);
    setNewJob({ ...newJob, requirements: updated });
  };

  const openMatchBreakdown = (match) => {
    setSelectedMatch(match);
    setShowMatchModal(true);
  };

  const runAutoReject = async () => {
    const confirmed = window.confirm(
        "This will automatically reject ALL candidates across all jobs who do not meet the minimum years of experience requirement. Proceed?"
    );
    
    if (!confirmed) return;

    setIsProcessing(true);
    try {
        const response = await axios.post(`${API_BASE}/recruiter/run-auto-reject`);
        alert(response.data.message);
        // Refresh data to reflect the new statuses
        fetchData(); 
    } catch (err) {
        alert("Error: " + (err.response?.data?.error || "Execution failed"));
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 relative">
      {showMatchModal && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowMatchModal(false)}></div>
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-black">{selectedMatch.FullName}</h3>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Match Breakdown • Score: {selectedMatch.TotalMatchScore}</p>
                    </div>
                    <button onClick={() => setShowMatchModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20}/></button>
                </div>
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-blue-400 uppercase">Exp Score</p>
                            <p className="text-xl font-black text-blue-700">+{selectedMatch.ExperienceScore}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-green-400 uppercase">Loc Bonus</p>
                            <p className="text-xl font-black text-green-700">+{selectedMatch.LocationBonus}</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Skill Alignment Analysis</p>
                    <div className="space-y-4">
                        {selectedMatch.SkillsDetails?.map((s, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span>{s.SkillName} {s.IsMandatory && <span className="text-red-500">*</span>}</span>
                                    <span className={s.CandidateLevel >= s.RequiredLevel ? "text-green-600" : "text-amber-600"}>
                                        {s.CandidateLevel} / {s.RequiredLevel}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full relative">
                                    <div className="absolute h-full bg-blue-500 rounded-full transition-all" style={{ width: `${s.CandidateLevel * 10}%` }}></div>
                                    <div className="absolute h-4 w-1 bg-slate-800 -top-1 rounded-full" style={{ left: `${s.RequiredLevel * 10}%` }} title="Required Level"></div>
                                </div>
                            </div>
                        )) || <div className="text-center py-10 text-gray-400 italic text-sm flex flex-col items-center gap-2"><AlertCircle size={32}/> Detailed skill data missing.</div>}
                    </div>

                    {/* INTERVIEW SCHEDULING FORM (CONDITIONAL) */}
                    {selectedMatch.StatusID === 3 && (
                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-600" /> Schedule Interview Session
                            </h4>
                            <form onSubmit={handleScheduleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Start Time</label>
                                        <input 
                                            type="datetime-local" 
                                            required 
                                            className="w-full p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            value={schedStart}
                                            onChange={(e) => setSchedStart(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">End Time</label>
                                        <input 
                                            type="datetime-local" 
                                            required 
                                            className="w-full p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            value={schedEnd}
                                            onChange={(e) => setSchedEnd(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                                >
                                    Confirm Slot & Send Notification
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</span>
                        <span className="text-sm font-bold text-blue-600">{selectedMatch.StatusName || 'Applied'}</span>
                    </div>
                    
                    <div className="flex gap-2">
                        {![4, 5].includes(selectedMatch.StatusID) && (
                            <button 
                                onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 5, 'Rejected')}
                                className="px-4 py-2 text-[10px] font-black uppercase bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
                            >
                                Reject
                            </button>
                        )}

                        {(selectedMatch.StatusID === 1 || !selectedMatch.StatusID) && (
                            <button 
                                onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 2, 'Screening')}
                                className="px-4 py-2 text-[10px] font-black uppercase bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
                            >
                                Start Screening
                            </button>
                        )}

                        {selectedMatch.StatusID === 2 && (
                            <button 
                                onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 3, 'Interview')}
                                className="px-4 py-2 text-[10px] font-black uppercase bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 transition"
                            >
                                Move to Interview
                            </button>
                        )}

                        {selectedMatch.StatusID === 3 && (
                            <button 
                                onClick={() => handleHireCandidate(selectedMatch.ApplicationID)}
                                className="px-6 py-2 text-[10px] font-black uppercase bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-2"
                            >
                                <UserPlus size={14}/> Final Hire
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tight">Recruiter Command</h2>
        
        <button
          onClick={runAutoReject}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase transition-all shadow-md 
            ${isProcessing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200'
            }`}
        >
          <ShieldAlert size={16} />
          {isProcessing ? "Cleaning Pipeline..." : "Auto-Reject Unqualified"}
        </button>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
            {showForm ? 'Cancel' : <><Plus size={16}/> Create Posting</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePostJob} className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <input placeholder="Job Title" className="w-full p-4 bg-gray-50 border rounded-xl outline-none" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}/>
                <textarea placeholder="Job Description" className="w-full p-4 bg-gray-50 border rounded-xl outline-none h-40" required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}/>
                <div className="pt-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Required Skills</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {availableSkills.map(skill => {
                            const req = newJob.requirements.find(r => r.skillId === skill.SkillID);
                            return (
                                <div key={skill.SkillID} className={`p-3 rounded-xl border transition ${req ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input type="checkbox" checked={!!req} onChange={() => toggleSkill(skill.SkillID)} className="rounded" />
                                        <span className="text-xs font-bold">{skill.SkillName}</span>
                                    </label>
                                    {req && (
                                        <div className="flex items-center gap-2">
                                            <input type="number" min="1" max="10" className="w-12 p-1 text-[10px] border rounded" value={req.minProficiency} onChange={(e) => updateSkillReq(skill.SkillID, 'minProficiency', e.target.value)}/>
                                            <label className="text-[9px] font-bold flex items-center gap-1">
                                                <input type="checkbox" checked={req.isMandatory} onChange={(e) => updateSkillReq(skill.SkillID, 'isMandatory', e.target.checked)} /> Mandatory
                                            </label>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <input placeholder="Location" className="w-full p-4 bg-gray-50 border rounded-xl outline-none" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})}/>
                <div><label className="text-[10px] font-black uppercase text-gray-400 ml-1">Min Experience</label><input type="number" className="w-full p-4 bg-gray-50 border rounded-xl outline-none" value={newJob.minExp} onChange={e => setNewJob({...newJob, minExp: e.target.value})}/></div>
                <div><label className="text-[10px] font-black uppercase text-gray-400 ml-1">Vacancies</label><input type="number" className="w-full p-4 bg-gray-50 border rounded-xl outline-none" value={newJob.vacancies} onChange={e => setNewJob({...newJob, vacancies: e.target.value})}/></div>
                <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-black uppercase mt-4 hover:bg-black transition">Publish Job</button>
            </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                Live Match Engine {selectedJob && <span className="text-blue-600">— {selectedJob.JobTitle}</span>}
            </h3>
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase"><tr><th className="px-8 py-5">Candidate</th><th className="px-8 py-5">Score</th><th className="px-8 py-5 text-right">Action</th></tr></thead>
                <tbody className="divide-y">
                    {matches.length > 0 ? matches.map((m, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-8 py-6 font-bold">
                                {m.FullName}
                                <div className="text-[9px] font-black uppercase text-blue-500">{m.StatusName}</div>
                            </td>
                            <td className="px-8 py-6 font-black text-blue-600">{m.TotalMatchScore}</td>
                            <td className="px-8 py-6 text-right">
                                <button onClick={() => openMatchBreakdown(m)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition uppercase tracking-tighter">Review & Manage</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="3" className="px-8 py-10 text-center text-gray-400 text-sm">No matches found. Ensure candidate meets mandatory requirements.</td></tr>}
                </tbody>
                </table>
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-gray-100 pb-2">
                <button onClick={() => setActiveTab('active')} className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-300'}`}>Active ({myJobs.length})</button>
                <button onClick={() => setActiveTab('archive')} className={`text-[10px] font-black uppercase tracking-widest pb-2 transition-all ${activeTab === 'archive' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-300'}`}>Archived ({archivedJobs.length})</button>
            </div>

            <div className="space-y-4">
                {(activeTab === 'active' ? myJobs : archivedJobs).map(job => (
                    <div key={job.JobID} onClick={() => setSelectedJob(job)} className={`p-6 rounded-2xl border cursor-pointer transition relative group ${selectedJob?.JobID === job.JobID ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 shadow-md' : 'bg-white hover:shadow-md'}`}>
                        <div className="absolute top-4 right-4 flex gap-2">
                            {activeTab === 'active' ? (
                                <button onClick={(e) => handleDeleteJob(job.JobID, e)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            ) : (
                                <button onClick={(e) => handleRestoreJob(job.JobID, e)} className="text-gray-300 hover:text-green-600 transition-colors"><Clock size={16}/></button>
                            )}
                        </div>
                        <div className="pr-8 mb-2">
                            <h4 className={`font-bold text-sm ${selectedJob?.JobID === job.JobID ? 'text-blue-700' : 'group-hover:text-blue-600'}`}>{job.JobTitle}</h4>
                            <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-tighter inline-block mt-1 ${activeTab === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{activeTab === 'active' ? 'Active' : 'Archived'}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase font-medium">{job.Location} • {job.Vacancies} Vacancies</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

// --- CANDIDATE DASHBOARD ---
function CandidateDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [profile, setProfile] = useState({ skills: [], docs: [] });
  const [allSkills, setAllSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ id: "", level: 5 });

  const refreshData = () => {
    axios.get(`${API_BASE}/jobs`).then(res => setJobs(res.data));
    axios.get(`${API_BASE}/candidate/apps/${user.UserID}`).then(res => setMyApps(res.data));
    axios.get(`${API_BASE}/candidate/profile/${user.UserID}`).then(res => setProfile(res.data));
    axios.get(`${API_BASE}/skills`).then(res => setAllSkills(res.data));
  };

  useEffect(() => { refreshData(); }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Confirm withdrawal?")) return;
    try {
      await axios.post(`${API_BASE}/withdraw`, { appId, userId: user.UserID });
      refreshData();
    } catch (err) { alert("Withdrawal failed."); }
  };

  const updateProfile = async () => {
    await axios.put(`${API_BASE}/candidate/profile`, { userId: user.UserID, location: profile.Location, yearsOfExperience: profile.YearsOfExperience });
    alert("Profile Updated");
    refreshData();
  };

  const addSkill = async () => {
    if(!newSkill.id) return;
    await axios.post(`${API_BASE}/candidate/skills`, { userId: user.UserID, skillId: newSkill.id, proficiency: newSkill.level });
    refreshData();
  };

  const uploadDoc = async () => {
    const name = prompt("Enter Document Name:");
    if(name) {
        await axios.post(`${API_BASE}/candidate/documents`, { userId: user.UserID, docName: name });
        refreshData();
    }
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-3xl border shadow-sm">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2"><UserCircle className="text-blue-600"/> PROFILE CONTROL</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 border-r pr-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Core Info</h3>
            <div><label className="text-xs font-bold">Location</label><input className="w-full p-2 bg-gray-50 border rounded-lg" value={profile.Location || ""} onChange={e => setProfile({...profile, Location: e.target.value})}/></div>
            <div><label className="text-xs font-bold">Years Exp</label><input type="number" className="w-full p-2 bg-gray-50 border rounded-lg" value={profile.YearsOfExperience || 0} onChange={e => setProfile({...profile, YearsOfExperience: e.target.value})}/></div>
            <button onClick={updateProfile} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold">SAVE</button>
            <div className="pt-4"><h3 className="text-xs font-bold text-gray-400 uppercase mb-2">My Docs</h3>
                {profile.docs?.map(d => (<div key={d.DocumentID} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mb-1"><FileText size={14}/> {d.DocumentName}</div>))}
                <button onClick={uploadDoc} className="text-blue-600 text-xs font-bold flex items-center gap-1"><Plus size={14}/> Add New</button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Skills Matrix</h3>
            <div className="flex gap-2">
              <select className="flex-1 p-2 bg-gray-50 border rounded-lg text-sm" value={newSkill.id} onChange={e => setNewSkill({...newSkill, id: e.target.value})}>
                <option value="">Select Skill</option>
                {allSkills.map(s => <option key={s.SkillID} value={s.SkillID}>{s.SkillName}</option>)}
              </select>
              <input type="number" max="10" className="w-16 p-2 bg-gray-50 border rounded-lg" value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}/>
              <button onClick={addSkill} className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map(s => (<div key={s.SkillID} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">{s.SkillName} {s.ProficiencyLevel}</div>))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-black mb-6">Opportunities</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.JobID} className="bg-white p-6 rounded-2xl shadow-sm border hover:border-blue-500 transition">
                <h3 className="font-bold">{job.JobTitle}</h3>
                <p className="text-xs text-gray-400 mb-4">{job.Location} • Exp: {job.MinExperience}y</p>
                <button onClick={() => axios.post(`${API_BASE}/apply`, { jobId: job.JobID, userId: user.UserID }).then(refreshData)} className="w-full bg-blue-50 text-blue-600 py-2 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition uppercase">Apply Now</button>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-black mb-6">Tracking</h2>
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 font-bold text-gray-400"><tr><th className="p-4">Job</th><th className="p-4">Status</th><th className="p-4 text-right">Opt</th></tr></thead>
              <tbody className="divide-y">{myApps.map(app => (
                <tr key={app.ApplicationID}><td className="p-4 font-bold">{app.JobTitle}</td><td className="p-4"><span className="text-blue-600 font-bold uppercase tracking-tighter">{app.StatusName}</span></td><td className="p-4 text-right"><button onClick={() => handleWithdraw(app.ApplicationID)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button></td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}