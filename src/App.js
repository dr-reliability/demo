import React, { useState, useEffect } from 'react';
import axios from 'axios';
import yaml from 'js-yaml';
import { Card, Button, Container, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry from 'react-masonry-css';
import ReactSlider from 'react-slider';
import './App.css';

const App = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearRange, setYearRange] = useState([1964, 2024]); // State for the year range
  const [isYearRangeVisible, setIsYearRangeVisible] = useState(true);
const [isStageVisible, setIsStageVisible] = useState(true);
const [isProblemsVisible, setIsProblemsVisible] = useState(true);
const [isAimVisible, setIsAimVisible] = useState(true);
const [isSolutionVisible, setIsSolutionVisible] = useState(true);

  const [Tags, setTags] = useState({
    Stage: new Set(['Preprocessing', 'Dimensionality Reduction', 'Quantitative Evaluation', 'Visualization']),
    Problems: new Set(['inaccurate', 'suboptimal', 'incomplete', 'unstable', 'uninterpretable', 'unscalable', 'irreflective', 'uninformed']),
    Aim: new Set(['Enhance reliability', 'Enhance awareness', 'Enhance Approachability']),
    Solution: new Set(['Improvements on DR', 'Improvements of Evaluation', 'Visualization Stage Solutions', 'DR framework', 'Visual Analytics System', 'Literature Review', 'Human-Centered Experiment', 'Computational Experiment']),
    GroupName: new Set(['Pioneer', 'Judge', 'Instructor', 'Explorer', 'Explainer', 'Architect'])
  });

  const [selectedTags, setSelectedTags] = useState(() => {
    const initialTags = {};
    Object.keys(Tags).forEach(category => {
      initialTags[category] = new Set();
    });
    return initialTags;
  });

  const [availableTags, setAvailableTags] = useState({
    Stage: new Set(),
    Problems: new Set(),
    Aim: new Set(),
    Solution: new Set()
  });

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchUrl = process.env.NODE_ENV === 'production' 
      ? 'https://dr-reliability.github.io/demo/papers3.yml' 
      : '/papers3.yml'; 
    
    axios.get(fetchUrl)
      .then(response => {
        const projects = yaml.load(response.data);
        const shuffledProjects = shuffleArray(projects);
        setAllProjects(shuffledProjects);
        setFilteredProjects(shuffledProjects);
        setAvailableTags(getAvailableTags(shuffledProjects));
      })
      .catch(error => console.error("Error loading or parsing YAML data:", error));
  }, []);

  useEffect(() => {
    const filterProjects = () => {
      const filtered = allProjects.filter(project =>
        Object.keys(selectedTags).every(category =>
          selectedTags[category].size === 0 || (
            project.Tags &&
            Array.from(selectedTags[category]).every(tag =>
              category === 'GroupName' ? project.Tags.GroupName === tag : project.Tags[tag] === 3.0
            )
          )
        ) &&
        (project.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.Authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.Venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.venueA.toLowerCase().includes(searchQuery.toLowerCase()) ||
         project.Year.toString().includes(searchQuery)) &&
        project.Year >= yearRange[0] && project.Year <= yearRange[1]
      );
      setFilteredProjects(filtered);
      setAvailableTags(getAvailableTags(filtered)); // Update available tags after filtering
    };

    filterProjects();
  }, [selectedTags, allProjects, searchQuery, yearRange]);
  
  const getAvailableTags = (projects) => {
    const availableTags = {
      Stage: new Set(),
      Problems: new Set(),
      Aim: new Set(),
      Solution: new Set()
    };

    projects.forEach(project => {
      Object.keys(availableTags).forEach(category => {
        Tags[category].forEach(tag => {
          if (project.Tags && project.Tags[tag] === 3) {
            availableTags[category].add(tag);
          }
        });
      });
    });

    return availableTags;
  };

  const toggleTag = (category, tag) => {
    if (category === 'GroupName') {
      setSelectedTags(prev => ({
        ...prev,
        [category]: prev[category].has(tag) ? new Set() : new Set([tag])
      }));
    } else {
      const newSet = new Set(selectedTags[category]);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      setSelectedTags(prev => ({ ...prev, [category]: newSet }));
    }
  };

  const getTagsForProject = (project) => {
    let projectTags = [];
    Object.keys(Tags).forEach(category => {
      Tags[category].forEach(tag => {
        if (project.Tags && project.Tags[tag] === 3) {
          projectTags.push({ category, tag });
        }
      });
    });
    return projectTags;
  };

  const breakpointColumnsObj = {
    default: 3,
    1400: 3,
    1000: 2,
    700: 1
  };

  const handleCardClick = (doi) => {
    const googleSearchUrl = `https://www.google.com/search?q=doi:${encodeURIComponent(doi)}`;
    window.open(googleSearchUrl, '_blank');
  };
  
  return (
    <Container fluid className="app-container" style={{ paddingLeft: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
      <h2 style={{ margin: 0, fontWeight: 'bold' }}>Exploring High-dimensional Backstage</h2>
    <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>
    
    </p>
        <div>
          <Button variant="primary" style={{ marginRight: '10px' }} onClick={() => window.open('', '_blank')}>
            GitHub
          </Button>
          <Button variant="secondary" onClick={() => window.open('https://your-paper-link.com', '_blank')}>
            Paper
          </Button>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)', position: 'relative' }}>
        
        {/* Filter Panel */}
        <div 
          style={{ 
            width: '23%', 
            position: 'fixed', 
            left: 0, 
            top: 60, 
            height: 'calc(100vh - 60px)', 
            overflowY: 'auto', 
            backgroundColor: '#f7f7f7', 
            padding: '15px 10px',
            borderRight: '1px solid #ddd'
          }}
        >
          
          {/* Search Bar */}
          <FormControl
            type="text"
            placeholder="Search by Title, Author, Venue, or Year"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginBottom: '15px',
              fontSize: '0.9rem',
              padding: '7px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
                    {/* Divider */}
                    <hr style={{ margin: '10px 0', borderColor: '#ddd' }} />
          
           {/* Group Names Filter */}
           <div style={{ marginBottom: '15px' }}>
            <h6>Group Names</h6>
            {Array.from(Tags.GroupName).map(tag => {
              const className = `group-name-btn group-name-${tag.toLowerCase()}`;
              return (
                <div
                  key={tag}
                  className={className}
                  onClick={() => toggleTag('GroupName', tag)}
                  style={{
                    opacity: selectedTags.GroupName.has(tag) ? 1 : 0.7,
                    fontWeight: selectedTags.GroupName.has(tag) ? 'bold' : 'normal',
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>

         


          {/* Divider */}
          <hr style={{ margin: '10px 0', borderColor: '#ddd' }} />
  
          {/* Existing Filters */}
          {Object.keys(Tags)
            .filter(key => key !== 'GroupName')
            .map(category => (
              <div key={category} style={{ marginBottom: '15px' }}>
                <h6>{category}</h6>
                
                {Array.from(Tags[category]).map(tag => (
  <Button
    key={tag}
    onClick={() => toggleTag(category, tag)}
    variant={selectedTags[category].has(tag) ? 'secondary' : 'outline-secondary'}
    className="mb-2"
    disabled={!availableTags[category].has(tag)}  // Disable if no projects match this filter
    style={
      !availableTags[category].has(tag) // When it's disabled
        ? {
            margin: '2px',
            backgroundColor: '#f0f0f0',  // Light background
            color: 'black',
            border: 'none',
            padding: '4px 7px',
            borderRadius: '5px',
            cursor: 'not-allowed',
            fontSize: '0.65rem',
            opacity: 0.3,  // Increase transparency for the disabled state
          }
        : selectedTags[category].has(tag)  // When it's selected
        ? {
            margin: '2px',
            backgroundColor: 'Grey',
            color: 'white',
            border: 'none',
            padding: '4px 7px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.65rem',
          }
        : { // Normal state
            margin: '2px',
            backgroundColor: '#f0f0f0',
            color: 'black',
            border: 'none',
            padding: '4px 7px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.65rem',
            opacity: 1,  // Full opacity for the active state
          }
    }
  >
    {tag}
  </Button>
))}

              </div>
            ))}
  
          <div className="Tags" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              id="reset-filter"
              onClick={() =>
                setSelectedTags({
                  Stage: new Set(),
                  Problems: new Set(),
                  Aim: new Set(),
                  Solution: new Set(),
                  GroupName: new Set(),
                })
              }
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '4px 7px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.7rem',
              }}
            >
              Reset X
            </Button>

            <Button
              id="serendipity-filter"
              onClick={() => setFilteredProjects(shuffleArray([...filteredProjects]))}
              style={{
                backgroundColor: 'grey',
                color: 'white',
                border: 'none',
                padding: '4px 7px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.7rem',
              }}
            >
              Serendipity
            </Button>
          </div>

        </div>
  
        {/* Main Content Area */}
        <div 
          style={{ 
            flex: 1, 
            marginLeft: '23%', 
            overflowY: 'auto', 
            padding: '10px' 
          }}
        >

  
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredProjects.map((project, index) => (
              <div
              key={index}
              className="card-body-wrapper"
              style={{
                borderColor: `var(--${project.Tags.GroupName.toLowerCase()})`,
                borderWidth: '4px',
                borderStyle: 'solid',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '1rem',
              }}
              onClick={() => handleCardClick(project.doi)}
            >
            
                <Card style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
                  <Card.Body>
                    <Card.Title className="card-title">{project.Title}</Card.Title>
                    <Card.Text className="card-author">{project.Authors}</Card.Text>
  
                    <div>
                      {getTagsForProject(project).map(({ category, tag }) => (
                        <Button
                          key={`${category}-${tag}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the card's onClick from firing
                            toggleTag(category, tag);
                          }}
                          variant={selectedTags[category].has(tag) ? 'secondary' : 'outline-secondary'}
                          className="mb-2"
                          style={
                            selectedTags[category].has(tag)
                              ? {
                                  margin: '2px',
                                  backgroundColor: 'Grey',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.6rem',
                                }
                              : {
                                  margin: '2px',
                                  backgroundColor: '#f0f0f0',
                                  color: 'black',
                                  border: 'none',
                                  padding: '4px 7px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '0.6rem',
                                }
                          }
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
  
                    <div
                      style={{
                        marginTop: '5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        className={`card-group-name-btn card-group-name-${project.Tags.GroupName.toLowerCase()}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card's onClick from firing
                          toggleTag('GroupName', project.Tags.GroupName);
                        }}
                        style={{
                          cursor: 'pointer',
                          opacity: selectedTags.GroupName.has(project.Tags.GroupName) ? 1 : 0.7,
                          fontWeight: selectedTags.GroupName.has(project.Tags.GroupName) ? 'bold' : 'normal',
                        }}
                      >
                        {project.Tags.GroupName}
                      </div>
                      <Card.Text className="card-venue">
                        {project.venueA} {project.Year}
                      </Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    </Container>
  );
};

export default App;
