export default function ProfileNavigation({ activeSection, setActiveSection }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-800">Navigation</h3>
      </div>
      <div className="p-2">
        <button 
          onClick={() => setActiveSection('profile')}
          className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
            activeSection === 'profile' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <i className="ri-user-line mr-3 text-lg"></i>
          <span>Profile</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('education')}
          className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
            activeSection === 'education' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <i className="ri-graduation-cap-line mr-3 text-lg"></i>
          <span>Education</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('work')}
          className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
            activeSection === 'work' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <i className="ri-briefcase-4-line mr-3 text-lg"></i>
          <span>Work Experience</span>
        </button>
        
        <button 
          onClick={() => setActiveSection('settings')}
          className={`flex w-full items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
            activeSection === 'settings' 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <i className="ri-settings-line mr-3 text-lg"></i>
          <span>Account Settings</span>
        </button>
      </div>
    </div>
  );
}
