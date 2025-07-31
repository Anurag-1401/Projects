const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OpenAIApi,
});

const fallbackTechnologies = [
  "JavaScript", "TypeScript", "Python", "Java",

  "React.js", "Angular","Next.js",

  "CSS3", "Tailwind CSS", "Bootstrap",

  "HTML5",  "Node.js", "Express.js", "Django", "Spring Boot",

  "MySQL", "MongoDB",  "Git", "GitHub"];


const front = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Bootstrap",
  "TypeScript",
  "Redux",
  "Material UI",
  "SASS/SCSS"
]

const back = [
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "PHP",
  "Laravel",
  "Ruby on Rails",
  "GraphQL",
  "REST API"
]

const db = [
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "Firebase",
  "Redis",
  "Oracle",
  "Supabase"
]

const tools = [
  "Git",
  "GitHub",
  "GitLab",
  "Docker",
  "Postman",
  "VS Code",
  "Figma",
  "Jira",
  "Netlify",
  "Vercel",
  "CI/CD",
  "Webpack"
]

const other = [
  "C++",
  "Java",
  "Python",
  "Data Structures",
  "Algorithms",
  "Unit Testing",
  "Jest",
  "AWS",
  "Google Cloud",
  "Firebase Auth",
  "OAuth",
  "Responsive Design"
]


const categories = {
  Frontend: front,
  Backend: back,
  Database: db,
  Tools: tools,
  Other:other
};




const jobTechnologies = [
  {
    role: "Frontend Developer",
    technologies: [
      "HTML", "CSS", "JavaScript", "React.js", "Vue.js", "Angular", "TypeScript",
      "Tailwind CSS", "SASS", "Next.js", "Redux", "Vite", "Webpack", "Jest"
    ]
  },
  {
    role: "Backend Developer",
    technologies: [
      "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Java", "Go",
      "Ruby on Rails", "PHP", "Laravel", "GraphQL", "MySQL", "PostgreSQL", "MongoDB"
    ]
  },
  {
    role: "Full Stack Developer",
    technologies: [
      "HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express.js",
      "MongoDB", "MySQL", "Next.js", "TypeScript", "Docker", "Git", "AWS", "REST API"
    ]
  },
  {
    role: "Web Developer",
    technologies: [
      "HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express.js",
      "MongoDB", "MySQL", "Next.js", "TypeScript", "Docker", "Git", "AWS", "REST API"
    ]
  },
  {
    role: "Web Coordinator",
    technologies: [
      "HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express.js",
      "MongoDB", "MySQL", "Next.js", "TypeScript", "Docker", "Git", "AWS", "REST API"
    ]
  },
  {
    role: "Website Developer",
    technologies: [
      "HTML", "CSS", "JavaScript", "React.js", "Node.js", "Express.js",
      "MongoDB", "MySQL", "Next.js", "TypeScript", "Docker", "Git", "AWS", "REST API"
    ]
  },
  {
    role: "DevOps Engineer",
    technologies: [
      "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform",
      "Jenkins", "GitHub Actions", "Ansible", "Linux", "Nginx", "Prometheus", "Grafana"
    ]
  },
  {
    role: "Data Scientist",
    technologies: [
      "Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras",
      "PyTorch", "Matplotlib", "Seaborn", "SQL", "Jupyter", "Hugging Face", "Spark"
    ]
  },
  {
    role: "AI/ML Engineer",
    technologies: [
      "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV",
      "Hugging Face Transformers", "LangChain", "NLP", "Docker", "Flask", "FastAPI"
    ]
  },
  {
    role: "Mobile App Developer",
    technologies: [
      "Flutter", "React Native", "Kotlin", "Swift", "Java (Android)", "Firebase",
      "Dart", "Xcode", "Android Studio"
    ]
  },
  {
    role: "Cybersecurity Engineer",
    technologies: [
      "Wireshark", "Metasploit", "Nmap", "Kali Linux", "Burp Suite",
      "Python", "Splunk", "SIEM Tools", "Firewall Configs", "Cryptography"
    ]
  },
  {
    role: "UI/UX Designer",
    technologies: [
      "Figma", "Adobe XD", "Sketch", "InVision", "Framer", "Canva",
      "HTML", "CSS", "Design Systems", "Wireframing", "Prototyping"
    ]
  },
  {
    role: "Cloud Engineer",
    technologies: [
      "AWS", "Azure", "Google Cloud Platform", "Terraform", "Docker",
      "Kubernetes", "Linux", "Bash", "CloudFormation", "CI/CD"
    ]
  },
  {
    role: "Game Developer",
    technologies: [
      "Unity", "Unreal Engine", "C#", "C++", "Godot", "Blender",
      "OpenGL", "DirectX", "Physics Engines", "Game AI"
    ]
  },
  {
    role: "Manager",
    technologies: [
      "Microsoft Excel", "Google Sheets", "Slack", "Trello", "Asana",
      "Notion", "Jira", "MS Word", "PowerPoint", "CRM Tools", "Communication Skills"
    ]
  },
  {
    role: "Team Head / Lead",
    technologies: [
      "Jira", "Trello", "Slack", "Leadership Skills", "Notion",
      "Git", "Agile Methodologies", "Documentation Tools", "Figma (for planning)"
    ]
  },
  
  {
    role: "Departmental Coordinator",
    technologies: [
      "Microsoft Project", "Excel", "Trello", "ClickUp", "Notion",
      "PowerPoint", "Calendar Tools", "Communication Tools (Zoom, Meet)"
    ]
  },
  {
    role: "Peon / Office Assistant",
    technologies: [
      "Basic Computer Knowledge", "MS Word", "MS Excel", "Printer/Scanner Usage",
      "Google Maps", "Communication Tools (Phone, WhatsApp)"
    ]
  },
  {
    role: "Clerk / Data Entry",
    technologies: [
      "MS Excel", "Google Sheets", "Typing Skills", "Tally", "Zoho Books",
      "MS Word", "Google Docs", "Email Clients", "PDF Tools"
    ]
  },
  {
    role: "Receptionist",
    technologies: [
      "CRM Software", "Phone Systems", "Google Calendar", "MS Word",
      "Email Management", "Communication Skills", "Front Desk Tools"
    ]
  },
  {
    role: "HR Executive",
    technologies: [
      "Zoho Recruit", "LinkedIn", "Google Sheets", "MS Excel", "Slack",
      "HRMS Tools", "ATS (Applicant Tracking Systems)", "Calendly", "Survey Tools"
    ]
  },
  {
    role: "Content Writer / Coordinator",
    technologies: [
      "Google Docs", "Grammarly", "Hemingway App", "SEO Tools", "Notion",
      "WordPress", "Canva", "MS Word", "ChatGPT", "Copy.ai"
    ]
  },
  {
    role: "Product Manager",
    technologies: [
      "Notion", "Jira", "Figma", "Google Analytics", "Mixpanel",
      "Slack", "Excel", "Lucidchart", "Miro", "Productboard", "Agile/Scrum"
    ]
  }
];




const Suggestions = async (req, res) => {

  const { title, description } = req.body || {};
  const {post} = req.body || {};
  const {cat} = req.query;

  try {

    if(title){
      const prompt = `
       You are an expert developer assistant. Based on the given project title and description, suggest the most likely technologies used. Return them as a JSON array only.
       
       Title: ${title}
       Description: ${description}
       
       Technologies:
       `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;

    const match = content.match(/\[.*\]/s);
    const technologies = match ? JSON.parse(match[0]) : [];

    return res.status(200).json({ tech:technologies });

    }else if(post) {
          const result = jobTechnologies.find((job) => job.role === post);
          if(result){
            res.status(200).json({message:"Skills found",JobTech:result})
          } else {
            return res.status(404).json({ message: "No skills found for this job role." });
          }

    }else {
      const data = categories[cat]
      res.status(200).json({message:"Skills found",Category:data})
    }

  } catch (error) {
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: "Quota exceeded. Please upgrade your OpenAI plan." });
    }
    
    res.status(200).json({ tech: fallbackTechnologies, warning: "AI suggestion failed. Returned default list." });

     
  }
};

module.exports = { Suggestions };
