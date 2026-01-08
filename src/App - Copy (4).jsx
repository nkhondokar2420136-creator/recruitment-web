import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Briefcase, BarChart3, Settings, LogOut, X,
  Search, Clock, ShieldAlert, ChevronRight, CheckCircle, Trash2, UserCircle, Plus, Star, FileText, Calendar, BriefcaseBusiness, AlertCircle, UserPlus, Check
} from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';


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

const BiasAnalysis = ({ data, title, subtitle, xKey }) => (
  <div className="bg-white p-6 rounded-3xl border shadow-sm">
    <div className="mb-6">
      <h3 className="text-sm font-black uppercase italic">{title}</h3>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey={xKey} fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" orientation="left" stroke="#cbd5e1" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#2563eb" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          <Bar yAxisId="left" dataKey="TotalApplicants" fill="#f8fafc" name="Applicants" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="HireRatePercent" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} name="Hire Rate %" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const BottleneckAlerts = ({ data }) => {
  const bottlenecks = data.filter(stage => stage.AvgDaysInStage > 7);
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-black uppercase italic">Pipeline <span className="text-red-600">Bottlenecks</span></h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exceeding 7-day target</p>
        </div>
        <AlertCircle size={18} className="text-red-500" />
      </div>
      <div className="space-y-3">
        {bottlenecks.length > 0 ? bottlenecks.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-red-600 font-black text-[10px]">
                {item.AvgDaysInStage}d
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-900">{item.StatusName}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase">{item.ApplicationsInStage} Candidates</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-6">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
            <p className="text-[10px] font-bold text-gray-400 uppercase">System Healthy</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- HELPER COMPONENT: RECRUITER LEADERBOARD ---
const RecruiterLeaderboard = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.SuccessfulHires - a.SuccessfulHires).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-black uppercase italic">Top <span className="text-blue-600">Recruiters</span></h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hiring Efficiency</p>
        </div>
      </div>
      <div className="space-y-4">
        {sortedData.map((recruiter, idx) => {
          const conversionRate = recruiter.InterviewsConducted > 0 
            ? ((recruiter.SuccessfulHires / recruiter.InterviewsConducted) * 100).toFixed(0) 
            : 0;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase text-slate-700">{recruiter.RecruiterName}</p>
                <p className="text-[9px] font-bold text-blue-600">{conversionRate}% Conv.</p>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-700" 
                  style={{ width: `${conversionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase">
                <span>{recruiter.InterviewsConducted} Int.</span>
                <span>{recruiter.SuccessfulHires} Hires</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VacancyUtilization = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-black uppercase italic">Vacancy <span className="text-green-600">Utilization</span></h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fulfillment vs Remaining</p>
        </div>
      </div>
      <div className="space-y-4">
        {data.slice(0, 5).map((job, idx) => {
          // Calculate totals and percentages from your view columns
          const total = job.FilledPositions + job.RemainingVacancies;
          const percent = total > 0 ? (job.FilledPositions / total) * 100 : 0;
          const isCritical = percent < 25; // Less than 25% filled

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase text-slate-700 truncate max-w-[120px]">
                  {job.JobTitle}
                </p>
                <div className="text-right">
                   <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isCritical ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {job.FilledPositions}/{total} Filled
                  </span>
                </div>
              </div>
              
              {/* Progress Bar Visual */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[7px] font-bold text-gray-400 uppercase">
                <span>{job.TotalApplications} Applicants</span>
                <span>{job.RemainingVacancies} Left</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillGapRadar = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase italic">Skill <span className="text-purple-600">Gap Analysis</span></h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Average Candidate Proficiency</p>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.slice(0, 6)}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis dataKey="SkillName" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#64748b' }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Proficiency"
              dataKey="SkillGap"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
            />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const GhostingAlert = ({ data }) => {
  const highRisk = data.filter(c => c.DaysSinceLastContact > 14);

  return (
    <div className="bg-white p-6 rounded-3xl border shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-black uppercase italic text-orange-600">Ghosting <span className="text-slate-900">Alerts</span></h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Contact {'>'} 14 Days</p>
        </div>
        <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
          <AlertCircle size={16} />
        </div>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
        {highRisk.length > 0 ? highRisk.map((candidate, idx) => (
          <div key={idx} className="p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-800">{candidate.CandidateName}</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase">{candidate.JobTitle}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-orange-600">{candidate.DaysSinceLastContact}d</p>
              <p className="text-[7px] font-bold text-orange-400 uppercase leading-none">Silent</p>
            </div>
          </div>
        )) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="text-green-500 mb-2" size={20} />
            <p className="text-[10px] font-bold text-gray-400 uppercase">All Candidates Contacted</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    username: '', email: '', password: '', 
    fullName: '', location: '', yearsOfExperience: 0 
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("Username, Email, and Password are required.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-black uppercase italic mb-6">Provision <span className="text-blue-600">Candidate</span></h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Account Username</label>
            <input className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Email Address</label>
            <input className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase text-gray-400">Full Legal Name</label>
            <input className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Location</label>
            <input className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="col-span-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Years of Exp</label>
            <input type="number" className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, yearsOfExperience: parseInt(e.target.value) || 0})} />
          </div>
          <div className="col-span-2 mt-4 pt-4 border-t">
            <label className="text-[10px] font-black uppercase text-gray-400">Initial Password</label>
            <input type="password" placeholder="••••••••" 
                   className="w-full bg-gray-100 border-none rounded-2xl px-4 py-3 text-sm font-bold" 
                   onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition font-bold">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition shadow-lg">Create & Link Profile</button>
        </div>
      </div>
    </div>
  );
};

const ApplicationFunnelCard = ({ data }) => {
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.ApplicationCount)) : 0;

  return (
    <div className="bg-white p-6 rounded-[32px] border shadow-sm flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Hiring Pipeline</h3>
        <h4 className="text-lg font-black italic uppercase">Application <span className="text-blue-600">Funnel</span></h4>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {data.map((stage, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase text-slate-700">{stage.StatusName}</span>
              <span className="text-sm font-black text-blue-600">{stage.ApplicationCount}</span>
            </div>
            <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-700"
                style={{ width: `${maxVal > 0 ? (stage.ApplicationCount / maxVal) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- MAIN ADMIN DASHBOARD ---
function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [locationBias, setLocationBias] = useState([]);
  const [experienceBias, setExperienceBias] = useState([]);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [recruiterPerf, setRecruiterPerf] = useState([]);
  const [vacancyData, setVacancyData] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]); // New Skill Gap State
  const [reports, setReports] = useState({ selected: 'vw_ApplicationFunnel', data: [] });
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [silentRejections, setSilentRejections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [funnelData, setFunnelData] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [candidateList, setCandidateList] = useState([]);
  const [appDetailedList, setAppDetailedList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [jobArchive, setJobArchive] = useState([]);
  const [appArchive, setAppArchive] = useState([]);
  const [entitySubTab, setEntitySubTab] = useState('jobs'); // Sub-tab state

const handleSaveCandidate = async (formData) => {
  try {
    // Hits the new specialized endpoint we created in server.js
    await axios.post(`${API_BASE}/admin/users/candidate`, formData);
    setIsModalOpen(false);
    fetchUsers(); // Refresh the table
    alert("Candidate user created and profile linked successfully!");
  } catch (err) {
    alert("Creation failed: " + (err.response?.data?.error || err.message));
  }
};

const fetchArchives = async () => {
    try {
        const [jobs, apps] = await Promise.all([
            axios.get(`${API_BASE}/admin/archives/jobs`),
            axios.get(`${API_BASE}/admin/archives/applications`)
        ]);
        setJobArchive(jobs.data);
        setAppArchive(apps.data);
    } catch (err) {
        console.error("Failed to fetch archives", err);
    }
};

  const reportList = [
    'vw_ApplicationFunnel', 'vw_SkillGapAnalysis', 'vw_TimeToHire', 
    'vw_RecruiterPerformance', 'vw_Bias_Location', 'vw_Bias_Experience',
    'vw_HiringBottlenecks', 'vw_SilentRejections', 'vw_VacancyUtilization'
  ];

  useEffect(() => {
    if (activeTab === 'overview') loadOverview();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'reports') loadReport(reports.selected);
    if (activeTab === 'entities') fetchEntities();
    if (activeTab === 'maintenance') fetchArchives();
  }, [activeTab]);

  const loadOverview = async () => {
  try {
    // We are fetching 9 distinct datasets here
    const [
      auditRes, locRes, expRes, bottleRes, 
      perfRes, vacRes, skillRes, silentRes, funnelRes
    ] = await Promise.all([
      axios.get(`${API_BASE}/admin/audit-logs`),
      axios.get(`${API_BASE}/admin/reports/vw_Bias_Location`),
      axios.get(`${API_BASE}/admin/reports/vw_Bias_Experience`),
      axios.get(`${API_BASE}/admin/reports/vw_HiringBottlenecks`),
      axios.get(`${API_BASE}/admin/reports/vw_RecruiterPerformance`),
      axios.get(`${API_BASE}/admin/reports/vw_VacancyUtilization`),
      axios.get(`${API_BASE}/admin/reports/vw_SkillGapAnalysis`),
      axios.get(`${API_BASE}/admin/reports/vw_SilentRejections`),
      axios.get(`${API_BASE}/admin/analytics/funnel`) // Your new specialized route
    ]);
    
    // Assigning to state
    setAudit(auditRes.data);
    setLocationBias(locRes.data);
    setExperienceBias(expRes.data);
    setBottlenecks(bottleRes.data);
    setRecruiterPerf(perfRes.data);
    setVacancyData(vacRes.data);
    setSkillGaps(skillRes.data);
    setSilentRejections(silentRes.data);
    setFunnelData(funnelRes.data); // Update the funnel state
  } catch (err) { 
    console.error("Dashboard Load Error:", err); 
  }
};

  const fetchUsers = () => {
    axios.get(`${API_BASE}/admin/users`).then(res => setUsers(res.data));
  };

  const toggleUserStatus = async (userId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}/toggle`);
      fetchUsers();
    } catch (err) { alert("Failed to update user status"); }
  };

  const loadReport = (view) => {
    axios.get(`${API_BASE}/admin/reports/${view}`).then(res => 
      setReports(prev => ({ ...prev, selected: view, data: res.data }))
    );
  };

  const fetchEntities = async () => {
  try {
    // Adding ?t=... ensures the URL is unique every time
    const [jobs, candidates, apps, skills] = await Promise.all([
      axios.get(`${API_BASE}/admin/jobs?t=${Date.now()}`),
      axios.get(`${API_BASE}/admin/candidates?t=${Date.now()}`),
      axios.get(`${API_BASE}/admin/applications-detailed?t=${Date.now()}`),
      axios.get(`${API_BASE}/admin/skills?t=${Date.now()}`)
    ]);
    
    setJobList(jobs.data);
    setCandidateList(candidates.data);
    setAppDetailedList(apps.data);
    setSkillList(skills.data || []);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  const handleAddSkill = async (e) => {
  e.preventDefault();
  try {
    await axios.post(`${API_BASE}/admin/skills`, { SkillName: newSkillName });
    setNewSkillName(''); // Clear input
    fetchEntities(); // Refresh list
  } catch (err) {
    console.error("Add failed", err.response?.data);
        alert(err.response?.data?.error || "Error");
  }
};

  const runMaintenance = async (proc) => {
    try {
        await axios.post(`${API_BASE}/admin/maintenance`, { procedure: proc });
        alert(`${proc} completed!`);
        fetchArchives(); // Refresh the lists to show newly archived data
    } catch (err) {
        alert("Error: " + err.message);
    }
};

  const filteredUsers = (users || []).filter(u => {
  // 1. Search filter: Check if username includes search term
  const matchesSearch = u.Username.toLowerCase().includes(searchTerm.toLowerCase());

  // 2. Role filter: Use == (double equals) to ignore type differences (string vs number)
  // Or force both to strings to be safe
  const matchesRole = roleFilter === 'all' || u.RoleID.toString() === roleFilter.toString();

  return matchesSearch && matchesRole;
});

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-black italic uppercase">Admin<span className="text-blue-600">Console</span></h2>
        <nav className="flex bg-gray-100 p-1 rounded-xl">
          {['overview', 'users', 'entities', 'reports', 'maintenance'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition ${activeTab === t ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* TOP ROW: BIAS ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BiasAnalysis data={locationBias} title="Geographic Bias" subtitle="Hire Rate vs Volume" xKey="Location" />
            <BiasAnalysis data={experienceBias} title="Experience Bias" subtitle="Hire Rate vs Career Stage" xKey="ExperienceGroup" />
          </div>

          {/* MIDDLE ROW: THE CORE INTEL GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <SkillGapRadar data={skillGaps} />
             <RecruiterLeaderboard data={recruiterPerf} />
             <VacancyUtilization data={vacancyData} />
             <GhostingAlert data={silentRejections} />
             <BottleneckAlerts data={bottlenecks} />
             <ApplicationFunnelCard data={funnelData} />
          </div>

          {/* BOTTOM ROW: AUDIT TRAIL */}
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Audit Trail</h3>
              <ShieldAlert size={16} className="text-gray-300" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-50 uppercase text-gray-400 font-black">
                  <tr><th className="p-3">Table</th><th className="p-3">Op</th><th className="p-3">Change</th><th className="p-3">User</th><th className="p-3">Date</th></tr>
                </thead>
                <tbody className="divide-y">
                  {audit.slice(0, 8).map(log => (
                    <tr key={log.AuditID} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-bold">{log.TableName}</td>
                      <td className="p-3 text-blue-600 font-black">{log.Operation}</td>
                      <td className="p-3 truncate max-w-[200px] font-medium">{log.OldValue} → {log.NewValue}</td>
                      <td className="p-3 font-mono text-gray-500 italic">{log.ChangedBy}</td>
                      <td className="p-3 text-gray-400">{new Date(log.ChangedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ... (Rest of the tabs: users, reports, maintenance remains the same as your previous block) ... */}
      
      {activeTab === 'users' && (
  <div className="space-y-4">
    {/* ACTION BAR */}
    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-3xl border shadow-sm gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
          <Users size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase italic leading-none">User <span className="text-blue-600">Directory</span></h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Showing {filteredUsers.length} entries</p>
        </div>
      </div>

      <div className="flex flex-1 max-w-2xl gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text"
            placeholder="SEARCH BY USERNAME..."
            className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-black uppercase focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter - Values match your Database RoleIDs */}
        <select 
          className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-[10px] font-black uppercase outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="1">Admins (1)</option>
          <option value="2">Recruiters (2)</option>
          <option value="3">Candidates (3)</option>
        </select>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition flex items-center gap-2 shadow-lg"
      >
        <UserPlus size={14} /> Create Candidate
      </button>
    </div>

    {/* USERS TABLE */}
    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
          <tr>
            <th className="px-8 py-5">User Identity</th>
            <th className="px-8 py-5">Role</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(u => (
              <tr key={u.UserID} className="hover:bg-gray-50 transition">
                <td className="px-8 py-5 font-bold flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-[10px]">
                    {u.Username ? u.Username.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  {u.Username}
                </td>
                <td className="px-8 py-5">
                   {/* This badge helps you verify the RoleID visually while debugging */}
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                    u.RoleID === 1 ? 'bg-purple-50 text-purple-600' : 
                    u.RoleID === 2 ? 'bg-orange-50 text-orange-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {u.RoleID === 1 ? 'Admin' : u.RoleID === 2 ? 'Recruiter' : 'Candidate'}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${u.IsActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {u.IsActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => toggleUserStatus(u.UserID)} 
                    className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl transition ${u.IsActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                  >
                    {u.IsActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-8 py-20 text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 italic">No users matching current filters</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* MODAL REMAINING THE SAME */}
    <UserModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSave={handleSaveCandidate} 
    />
  </div>
)}

{activeTab === 'entities' && (
  <div className="space-y-6">
    {/* SUB-NAVBAR - Added 'skills' to the array */}
    <div className="flex gap-4 border-b pb-4">
      {['jobs', 'applications', 'candidates', 'skills'].map(sub => (
        <button 
          key={sub}
          onClick={() => setEntitySubTab(sub)}
          className={`text-[10px] font-black uppercase px-4 py-2 rounded-full transition ${
            entitySubTab === sub ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          {sub}
        </button>
      ))}
    </div>

    {/* QUICK ADD SKILL FORM - Only visible when 'skills' tab is active */}
    {entitySubTab === 'skills' && (
      <div className="bg-slate-50 p-4 rounded-3xl border border-dashed border-slate-300">
        <form onSubmit={handleAddSkill} className="flex gap-3">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="ENTER NEW SKILL NAME (E.G. NODE.JS, DOCKER)..."
              className="w-full bg-white border rounded-xl px-4 py-2.5 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 transition flex items-center gap-2 shadow-sm"
          >
            Add New Skill
          </button>
        </form>
      </div>
    )}

    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
      <table className="w-full text-left text-[11px]">
        <thead className="bg-gray-50 uppercase text-gray-400 font-black">
          {entitySubTab === 'jobs' && (
            <tr><th className="p-5">Title</th><th className="p-5">Location</th><th className="p-5">Exp Req</th><th className="p-5">Vacancies</th></tr>
          )}
          {entitySubTab === 'applications' && (
            <tr><th className="p-5">Candidate</th><th className="p-5">Job Title</th><th className="p-5">Status</th><th className="p-5">Applied Date</th></tr>
          )}
          {entitySubTab === 'candidates' && (
            <tr><th className="p-5">Full Name</th><th className="p-5">Exp (Years)</th><th className="p-5">Location</th><th className="p-5">Email</th></tr>
          )}
          {/* New Header for Skills */}
          {entitySubTab === 'skills' && (
            <tr><th className="p-5 w-24">Skill ID</th><th className="p-5">Skill Name</th><th className="p-5 text-right">Records</th></tr>
          )}
        </thead>
        <tbody className="divide-y">
          {entitySubTab === 'jobs' && jobList.map(j => (
            <tr key={j.JobID} className="hover:bg-gray-50 transition">
              <td className="p-5 font-bold uppercase">{j.JobTitle}</td>
              <td className="p-5">{j.Location}</td>
              <td className="p-5 font-mono">{j.MinExperience} Yrs</td>
              <td className="p-5 font-black text-blue-600">{j.Vacancies}</td>
            </tr>
          ))}
          {entitySubTab === 'applications' && appDetailedList.map(a => (
            <tr key={a.ApplicationID} className="hover:bg-gray-50 transition">
              <td className="p-5 font-bold uppercase">{a.FullName}</td>
              <td className="p-5">{a.JobTitle}</td>
              <td className="p-5">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-black uppercase text-[9px]">{a.StatusName}</span>
              </td>
              <td className="p-5 text-gray-400">{new Date(a.AppliedDate).toLocaleDateString()}</td>
            </tr>
          ))}
          {entitySubTab === 'candidates' && candidateList.map(c => (
            <tr key={c.CandidateID} className="hover:bg-gray-50 transition">
              <td className="p-5 font-bold uppercase">{c.FullName}</td>
              <td className="p-5 font-mono">{c.YearsOfExperience}</td>
              <td className="p-5">{c.Location}</td>
              <td className="p-5 italic text-gray-500">{c.Email}</td>
            </tr>
          ))}
          {/* New Body Mapping for Skills */}
          {entitySubTab === 'skills' && skillList.map(s => (
            <tr key={s.SkillID} className="hover:bg-gray-50 transition">
              <td className="p-5 font-mono text-gray-400"># {s.SkillID}</td>
              <td className="p-5 font-black uppercase text-slate-800">{s.SkillName}</td>
              <td className="p-5 text-right">
                <span className="text-[9px] font-bold text-gray-300 uppercase italic">System Protected</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
            <BarChart3 size={18} className="text-blue-600" />
            <select 
              className="flex-1 bg-transparent font-bold text-sm outline-none cursor-pointer"
              value={reports.selected} 
              onChange={(e) => loadReport(e.target.value)}
            >
              {reportList.map(r => <option key={r} value={r}>{r.replace('vw_', '').split('_').join(' ')}</option>)}
            </select>
          </div>
          <div className="bg-white rounded-3xl border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-50 uppercase text-gray-400 font-black">
                {reports.data[0] && <tr>{Object.keys(reports.data[0]).map(k => <th key={k} className="p-4">{k}</th>)}</tr>}
              </thead>
              <tbody className="divide-y">
                {reports.data.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition">
                    {Object.values(row).map((v, j) => <td key={j} className="p-4 font-medium">{v?.toString() || '-'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
  <div className="space-y-10">
    {/* Action Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-10 bg-white border rounded-[40px] text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 font-black">DB</div>
        <h4 className="font-black uppercase tracking-tight">Data Archival</h4>
        <p className="text-xs text-gray-500 leading-relaxed">Moves old job postings and rejected applications to the archive tables.</p>
        <button onClick={() => runMaintenance('sp_ArchiveOldData')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs hover:bg-black transition shadow-lg">Run Archive</button>
      </div>

      <div className="p-10 bg-white border rounded-[40px] text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-400 font-black">GDPR</div>
        <h4 className="font-black uppercase tracking-tight text-red-600">Compliance Flush</h4>
        <p className="text-xs text-gray-500 leading-relaxed">Anonymizes PII for candidates currently in the archive tables.</p>
        <button onClick={() => runMaintenance('sp_AnonymizeArchivedCandidates')} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-red-700 transition shadow-lg shadow-red-100">Run Flush</button>
      </div>
    </div>

    {/* Archive Data Tables */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Job Archive */}
      <div className="bg-white border rounded-[40px] p-8">
        <h3 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
          Job Postings Archive
        </h3>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white border-b uppercase font-black text-gray-400">
              <tr>
                <th className="pb-3 px-2">Job Title</th>
                <th className="pb-3 px-2">Archived At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobArchive.length > 0 ? jobArchive.map((job, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-2 font-bold">{job.JobTitle}</td>
                  <td className="py-4 px-2 text-gray-400">{new Date(job.ArchivedAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="2" className="py-10 text-center text-gray-300 italic">No archived jobs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Archive */}
      <div className="bg-white border rounded-[40px] p-8">
        <h3 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          Applications Archive
        </h3>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-white border-b uppercase font-black text-gray-400">
              <tr>
                <th className="pb-3 px-2">Candidate</th>
                <th className="pb-3 px-2">Job Title</th>
                <th className="pb-3 px-2">Archived At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appArchive.length > 0 ? appArchive.map((app, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-2 font-bold">{app.FullName || `Candidate #${app.CandidateID}`}</td>
                  <td className="py-4 px-2">{app.JobTitle || 'N/A'}</td>
                  <td className="py-4 px-2 text-gray-400">{new Date(app.ArchivedAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="py-10 text-center text-gray-300 italic">No archived applications</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

// --- RECRUITER DASHBOARD (UPDATED WITH SUMMARY METRICS) ---
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

  // --- NEW STATE FOR SUMMARY ---
  const [summary, setSummary] = useState({ ActiveJobs: 0, NewApplications: 0, InterviewsToday: 0 });

  // Scheduling States
  const [schedStart, setSchedStart] = useState("");
  const [schedEnd, setSchedEnd] = useState("");

  const [newJob, setNewJob] = useState({ 
    title: '', description: '', location: '', minExp: 0, vacancies: 1, requirements: [] 
  });

  const fetchData = async () => {
    try {
      // Updated to fetch summary data alongside jobs and skills
      const [activeRes, archivedRes, skillsRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/recruiter/jobs/${user.UserID}`),
        axios.get(`${API_BASE}/recruiter/jobs/archived/${user.UserID}`),
        axios.get(`${API_BASE}/skills`),
        axios.get(`${API_BASE}/recruiter/summary/${user.UserID}`)
      ]);
      
      setMyJobs(activeRes.data);
      setArchivedJobs(archivedRes.data);
      setAvailableSkills(skillsRes.data);
      setSummary(summaryRes.data); // Update summary state

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
        fetchData(); // Refresh metrics
    } catch (err) {
        alert("Status Update Failed: " + (err.response?.data?.error || "Invalid transition."));
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
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
        setShowMatchModal(false);
        fetchData(); // Update "Interviews Today" count
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
    const confirmed = window.confirm("Reject ALL unqualified candidates? Proceed?");
    if (!confirmed) return;
    setIsProcessing(true);
    try {
        const response = await axios.post(`${API_BASE}/recruiter/run-auto-reject`);
        alert(response.data.message);
        fetchData(); 
    } catch (err) {
        alert("Error: " + (err.response?.data?.error || "Execution failed"));
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 relative">
      {/* MODAL SECTION */}
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

                    {selectedMatch.StatusID === 3 && (
                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-600" /> Schedule Interview Session
                            </h4>
                            <form onSubmit={handleScheduleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Start Time</label>
                                        <input type="datetime-local" required className="w-full p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={schedStart} onChange={(e) => setSchedStart(e.target.value)}/>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">End Time</label>
                                        <input type="datetime-local" required className="w-full p-2 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={schedEnd} onChange={(e) => setSchedEnd(e.target.value)}/>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-100">Confirm Slot & Send Notification</button>
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
                            <button onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 5, 'Rejected')} className="px-4 py-2 text-[10px] font-black uppercase bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition">Reject</button>
                        )}
                        {(selectedMatch.StatusID === 1 || !selectedMatch.StatusID) && (
                            <button onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 2, 'Screening')} className="px-4 py-2 text-[10px] font-black uppercase bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition">Start Screening</button>
                        )}
                        {selectedMatch.StatusID === 2 && (
                            <button onClick={() => handleStatusUpdate(selectedMatch.ApplicationID, 3, 'Interview')} className="px-4 py-2 text-[10px] font-black uppercase bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 transition">Move to Interview</button>
                        )}
                        {selectedMatch.StatusID === 3 && (
                            <button onClick={() => handleHireCandidate(selectedMatch.ApplicationID)} className="px-6 py-2 text-[10px] font-black uppercase bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition flex items-center gap-2"><UserPlus size={14}/> Final Hire</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tight">Recruiter Command</h2>
        <div className="flex gap-4">
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
      </div>

      {/* --- ADDED SUMMARY METRICS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Briefcase size={24} /></div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Postings</p>
                <h3 className="text-2xl font-black text-slate-900">{summary.ActiveJobs}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 relative">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Users size={24} /></div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Awaiting Review</p>
                <h3 className="text-2xl font-black text-slate-900">{summary.NewApplications}</h3>
            </div>
            {summary.NewApplications > 0 && (
                <span className="absolute top-6 right-6 bg-amber-500 text-white text-[9px] px-2 py-1 rounded-lg font-black animate-pulse uppercase">Action Required</span>
            )}
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><Calendar size={24} /></div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Interviews Today</p>
                <h3 className="text-2xl font-black text-slate-900">{summary.InterviewsToday}</h3>
            </div>
        </div>
      </div>

      {/* JOB POSTING FORM */}
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

      {/* MATCH ENGINE GRID */}
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
  const [interviews, setInterviews] = useState([]); // NEW: Interview state
  const [newSkill, setNewSkill] = useState({ id: "", level: 5 });
  const [selectedGap, setSelectedGap] = useState(null);
  const [inspectingJobId, setInspectingJobId] = useState(null);

  const API_BASE = "http://localhost:5000/api";

  // 1. Refreshes all data to keep UI in sync with DB
  const refreshData = async () => {
    try {
      const [jobsRes, appsRes, profileRes, docsRes, skillsRes, interviewRes] = await Promise.all([
        axios.get(`${API_BASE}/candidate/recommendations/${user.UserID}`),
        axios.get(`${API_BASE}/candidate/apps/${user.UserID}`),
        axios.get(`${API_BASE}/candidate/profile/${user.UserID}`),
        axios.get(`${API_BASE}/candidate/documents/${user.UserID}`),
        axios.get(`${API_BASE}/skills`),
        axios.get(`${API_BASE}/candidate/interviews/${user.UserID}`) // NEW
      ]);

      setJobs(jobsRes.data);
      setMyApps(appsRes.data);
      setProfile({ ...profileRes.data, docs: docsRes.data });
      setAllSkills(skillsRes.data);
      setInterviews(interviewRes.data); // NEW
    } catch (err) {
      console.error("Data refresh failed", err);
    }
  };

  useEffect(() => { refreshData(); }, []);

  // NEW: Confirm Interview Handler
  const handleConfirmInterview = async (scheduleId) => {
    try {
      await axios.put(`${API_BASE}/candidate/interviews/confirm`, { 
        scheduleId, 
        userId: user.UserID 
      });
      refreshData();
    } catch (err) {
      alert("Confirmation failed: " + err.response?.data?.error || err.message);
    }
  };

  const checkSkillGap = async (jobId) => {
    if (inspectingJobId === jobId) { setInspectingJobId(null); return; }
    try {
      const res = await axios.get(`${API_BASE}/candidate/skill-gap/${jobId}/${user.UserID}`);
      setSelectedGap(res.data);
      setInspectingJobId(jobId);
    } catch (err) { console.error("Failed to fetch skill gap"); }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Confirm withdrawal?")) return;
    try {
      await axios.post(`${API_BASE}/withdraw`, { appId, userId: user.UserID });
      await refreshData();
    } catch (err) { console.error(err); alert("Withdrawal failed."); }
  };

  const updateProfile = async () => {
    await axios.put(`${API_BASE}/candidate/profile`, { userId: user.UserID, location: profile.Location, yearsOfExperience: profile.YearsOfExperience });
    alert("Profile Updated");
    refreshData();
  };

  const addSkill = async () => {
    if(!newSkill.id) return;
    await axios.post(`${API_BASE}/candidate/skills`, { userId: user.UserID, skillId: newSkill.id, proficiency: newSkill.level });
    setNewSkill({ id: "", level: 5 });
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
    <div className="space-y-10 max-w-7xl mx-auto p-4">
      
      {/* SECTION 1: PROFILE & SKILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1 bg-white p-8 rounded-[40px] border shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b pb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg">
              <UserCircle size={32} />
            </div>
            <div>
              <h2 className="font-black text-xl uppercase tracking-tight">Profile</h2>
              <p className="text-xs text-gray-400 font-bold uppercase">{user.Username}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preferred Location</label>
              <input className="w-full mt-1 p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={profile.Location || ""} onChange={e => setProfile({...profile, Location: e.target.value})}/>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience (Years)</label>
              <input type="number" className="w-full mt-1 p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={profile.YearsOfExperience || 0} onChange={e => setProfile({...profile, YearsOfExperience: e.target.value})}/>
            </div>
            <button onClick={updateProfile} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase hover:bg-black transition shadow-lg">Save Profile</button>
          </div>
          <div className="pt-4 space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documents</h3>
            {profile.docs?.map(d => (
              <div key={d.DocumentID} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl group cursor-pointer hover:bg-slate-100 transition">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <FileText size={16} className="text-blue-500"/> {d.DocumentName}
                </div>
              </div>
            ))}
            <button onClick={uploadDoc} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-blue-400 hover:text-blue-500 transition">Add Document</button>
          </div>
        </section>

        <section className="lg:col-span-2 bg-white p-8 rounded-[40px] border shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div> Skills Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {profile.skills?.map(s => (
                <div key={s.SkillID} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span>{s.SkillName}</span>
                    <span className="text-blue-600">Level {s.ProficiencyLevel}/10</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${s.ProficiencyLevel * 10}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-6 rounded-[30px] space-y-4 h-fit">
              <h4 className="text-[10px] font-black uppercase text-slate-400">Add or Update Skill</h4>
              <select className="w-full p-3 bg-white border-none rounded-xl text-sm font-bold" value={newSkill.id} onChange={e => setNewSkill({...newSkill, id: e.target.value})}>
                <option value="">Choose Skill...</option>
                {allSkills.map(s => <option key={s.SkillID} value={s.SkillID}>{s.SkillName}</option>)}
              </select>
              <div className="flex items-center gap-4">
                 <input type="range" min="1" max="10" className="flex-1 accent-blue-600" value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})}/>
                 <span className="font-black text-blue-600">{newSkill.level}</span>
              </div>
              <button onClick={addSkill} className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-md shadow-blue-100">Add to Matrix</button>
            </div>
          </div>
        </section>
      </div>

      {/* NEW SECTION: UPCOMING INTERVIEWS (MEETINGS CARD) */}
      <section className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          Upcoming Interviews <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-1 rounded-md">{interviews.length} SCHEDULED</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviews.length > 0 ? interviews.map((meeting) => (
            <div key={meeting.ScheduleID} className="bg-white p-6 rounded-[35px] border shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${meeting.TimeStatus === 'Upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  {meeting.TimeStatus}
                </div>
                {meeting.CandidateConfirmed ? (
                  <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase">
                    <CheckCircle size={14} /> Confirmed
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-500 text-[10px] font-black uppercase animate-pulse">
                    <AlertCircle size={14} /> Action Required
                  </div>
                )}
              </div>

              <h3 className="font-black text-lg leading-tight">{meeting.JobTitle}</h3>
              <p className="text-xs text-gray-400 font-bold mb-4 italic">with {meeting.RecruiterName}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Calendar size={14} className="text-blue-500" />
                  {new Date(meeting.InterviewStart).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Clock size={14} className="text-blue-500" />
                  {new Date(meeting.InterviewStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.InterviewEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {!meeting.CandidateConfirmed && meeting.TimeStatus === 'Upcoming' && (
                <button 
                  onClick={() => handleConfirmInterview(meeting.ScheduleID)}
                  className="w-full py-3 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-amber-600 transition shadow-lg shadow-amber-100"
                >
                  Confirm Attendance
                </button>
              )}
            </div>
          )) : (
            <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[35px] p-10 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
              No meetings scheduled yet
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: JOBS & TRACKING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            Smart Recommendations <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-md">BETA</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => {
              const alreadyApplied = myApps.some(app => app.JobID === job.JobID);
              return (
                <div key={job.JobID} className={`bg-white p-6 rounded-[35px] border transition-all relative overflow-hidden ${alreadyApplied ? 'opacity-80' : 'hover:border-blue-500'}`}>
                  {job.TotalMatchScore && !alreadyApplied && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-2xl font-black text-[10px]">
                      {Math.round(job.TotalMatchScore)}% MATCH
                    </div>
                  )}
                  {alreadyApplied && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-2 rounded-bl-2xl font-black text-[10px] flex items-center gap-1">
                      <Check size={10} /> APPLIED
                    </div>
                  )}
                  <h3 className="font-black text-lg mt-2">{job.JobTitle}</h3>
                  <p className="text-xs text-gray-400 font-bold mb-4">{job.Location} • {job.MinExperience}yr Exp</p>
                  {inspectingJobId === job.JobID && selectedGap && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-2xl space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-400">Requirement Breakdown</p>
                      {selectedGap.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px]">
                          <span className={`font-bold ${skill.Status === 'Missing' ? 'text-red-500' : 'text-slate-700'}`}>
                            {skill.SkillName} {skill.IsMandatory ? '*' : ''}
                          </span>
                          <span className="font-black">{skill.CandidateLevel} / {skill.RequiredLevel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                      <button onClick={() => checkSkillGap(job.JobID)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] hover:bg-slate-50 transition uppercase">
                        {inspectingJobId === job.JobID ? 'Hide Info' : 'Analyze Fit'}
                      </button>
                      {alreadyApplied ? (
                        <button disabled className="flex-[2] py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase cursor-not-allowed">Application Pending</button>
                      ) : (
                        <button onClick={() => axios.post(`${API_BASE}/apply`, { jobId: job.JobID, userId: user.UserID }).then(refreshData)} className="flex-[2] py-3 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-black transition uppercase shadow-lg shadow-blue-100">Apply Now</button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Active Tracking</h2>
          <div className="bg-white rounded-[40px] border shadow-sm divide-y">
            {myApps.length > 0 ? myApps.map(app => (
              <div key={app.ApplicationID} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition">
                <div>
                  <h4 className="font-black text-sm uppercase truncate w-32">{app.JobTitle}</h4>
                  <p className={`text-[10px] font-black uppercase mt-1 ${
                      app.StatusName === 'Rejected' ? 'text-red-500' : 
                      app.StatusName === 'Hired' ? 'text-emerald-500' : 'text-blue-500'
                  }`}> {app.StatusName} </p>
                </div>
                <button onClick={() => handleWithdraw(app.ApplicationID)} className="p-3 text-slate-200 hover:text-red-500 transition-colors">
                  <Trash2 size={20}/>
                </button>
              </div>
            )) : (
              <div className="p-10 text-center text-xs text-gray-400 font-bold uppercase italic">No active applications</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}