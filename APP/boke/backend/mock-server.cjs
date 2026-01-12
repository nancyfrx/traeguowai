const http = require('http');

const PORT = 8081;

const blogs = [
  { 
    id: 1, 
    title: 'The Future of Neural Interfaces', 
    content: 'Exploring how brain-computer interfaces are evolving from medical prosthetics to consumer enhancements. The convergence of biology and silicon is no longer science fiction.', 
    author: 'Dr. Aris Thorne', 
    createTime: '2026-01-12T09:00:00',
    category: 'Cybernetics',
    readingTime: '8 min',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Neon Tokyo: A Photographic Journey', 
    content: 'Capturing the vibrant night life of Shinjuku and Shibuya. The interplay of rain-slicked asphalt and cybernetic glow creates a timeless atmosphere.', 
    author: 'Kaito Chen', 
    createTime: '2026-01-11T21:30:00',
    category: 'Photography',
    readingTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Sustainable Mars Habitat Design', 
    content: 'How we are using Martian regolith and 3D printing technology to build the first permanent human settlements on the red planet.', 
    author: 'Sarah Jenkins', 
    createTime: '2026-01-10T14:45:00',
    category: 'Space',
    readingTime: '12 min',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 4, 
    title: 'The Rise of AI Sovereignty', 
    content: 'Discussing the legal and ethical implications of autonomous AI entities and their potential for self-governance in digital jurisdictions.', 
    author: 'Lex Digitalis', 
    createTime: '2026-01-09T10:20:00',
    category: 'Legal Tech',
    readingTime: '10 min',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 5, 
    title: 'Quantum Computing for Creatives', 
    content: 'Simplifying quantum superposition and entanglement for designers and artists looking to leverage the next leap in computing power.', 
    author: 'Elena Volt', 
    createTime: '2026-01-08T16:15:00',
    category: 'Quantum',
    readingTime: '7 min',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop'
  },
  { 
    id: 6, 
    title: 'Bio-Digital Architecture', 
    content: 'Buildings that breathe and grow. The future of urban design lies in synthetic biology and responsive materials.', 
    author: 'Marcus Green', 
    createTime: '2026-01-07T12:00:00',
    category: 'Architecture',
    readingTime: '9 min',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop'
  }
];

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/blogs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(blogs));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Mock Backend Server running at http://localhost:${PORT}`);
});
