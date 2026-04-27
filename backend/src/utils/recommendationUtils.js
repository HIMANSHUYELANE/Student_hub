/**
 * Heuristic Rule-Based Engine for generating career/skill recommendations
 * based on academic results and extracurricular activities.
 */

const generateRecommendations = (latestResult, activities) => {
  const recommendations = [];

  // Define some mapping rules
  const academicRules = [
    { subject: /mathematics/i, path: 'Data Scientist / Quantitative Analyst', reason: 'You excel in Mathematics, showing strong analytical and problem-solving skills.' },
    { subject: /computer science|programming|it/i, path: 'Software Engineer / AI Infrastructure Engineer', reason: 'Your high performance in Computer Science indicates a strong foundation for a tech career.' },
    { subject: /physics/i, path: 'Research Scientist / Engineer', reason: 'A strong grasp of Physics is great for engineering and research roles.' },
    { subject: /biology|chemistry/i, path: 'Healthcare / Biotechnology Professional', reason: 'High marks in natural sciences suggest a potential career in healthcare or research.' },
    { subject: /english|literature/i, path: 'Content Strategist / Journalist', reason: 'Your proficiency in literature and language can lead to a successful career in communication and media.' },
    { subject: /business|economics/i, path: 'Financial Analyst / Business Consultant', reason: 'Strong performance in business subjects opens doors to finance and management roles.' }
  ];

  const activityRules = [
    { category: /sports/i, path: 'Professional Sports / Athletics / Sports Management', reason: 'Your competitive excellence and dedication in sports can be channeled into a professional athletic or management career.' },
    { category: /technical|coding/i, path: 'Tech Innovator / Lead Developer', reason: 'Winning technical competitions shows a competitive edge and practical application of coding skills.' },
    { category: /cultural|arts|music|dance/i, path: 'Creative Arts Professional / Performer', reason: 'Your achievements in cultural activities highlight your creativity and expressive talents.' },
    { category: /leadership|debate|mun/i, path: 'Public Policy / Management / Law', reason: 'Participation in debates and leadership roles demonstrates strong communication and leadership abilities.' }
  ];

  // Analyze Academic Results
  if (latestResult && latestResult.subjects && Array.isArray(latestResult.subjects)) {
    latestResult.subjects.forEach(sub => {
      // Assuming sub has { name, marks, maxMarks } or similar structure
      // Let's say high performance is > 80%
      const percentage = (sub.marks / (sub.maxMarks || 100)) * 100;
      if (percentage >= 80) {
        const rule = academicRules.find(r => r.subject.test(sub.name));
        if (rule) {
          recommendations.push({
            type: 'Academic',
            title: rule.path,
            description: `Based on your excellence in ${sub.name}`,
            rationale: rule.reason
          });
        }
      }
    });
  }

  // Analyze Extracurricular Activities
  if (activities && Array.isArray(activities)) {
    activities.forEach(activity => {
      // Assuming activity has { name, category, achievement } or similar
      // E.g., achievement = 'Winner', 'Runner-up', 'Participant'
      const isHighAchiever = /winner|runner-up|first|second|gold|silver|champion/i.test(activity.achievement || activity.position || activity.role || activity.description || '');
      
      if (isHighAchiever) {
        const rule = activityRules.find(r => r.category.test(activity.category));
        if (rule) {
          recommendations.push({
            type: activity.category || 'Extracurricular',
            title: rule.path,
            description: `Based on your outstanding performance in ${activity.name || activity.category}`,
            rationale: rule.reason
          });
        }
      }
    });
  }

  // Deduplicate recommendations by title
  const uniqueRecs = [];
  const titles = new Set();
  for (const rec of recommendations) {
    if (!titles.has(rec.title)) {
      titles.add(rec.title);
      uniqueRecs.push(rec);
    }
  }

  // Provide a default if nothing matches
  if (uniqueRecs.length === 0) {
    uniqueRecs.push({
      type: 'General',
      title: 'Explore Diverse Opportunities',
      description: 'Keep exploring different subjects and activities.',
      rationale: 'You are building a balanced profile. Continue participating in diverse areas to discover your true passion.'
    });
  }

  return uniqueRecs;
};

module.exports = {
  generateRecommendations
};
