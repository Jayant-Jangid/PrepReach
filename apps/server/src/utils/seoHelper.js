const generateCourseSeo = (course) => {
  return {
    title: `${course.title} - PrepReach Online Preparation`,
    metaDescription: course.description ? course.description.slice(0, 155) : '',
    canonicalUrl: `https://prepreach.in/courses/${course.slug}`,
    openGraph: {
      title: course.title,
      description: course.description,
      type: 'website',
      image: course.thumbnail || 'https://prepreach.in/assets/prepreach_logo.png',
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'PrepReach',
        sameAs: 'https://prepreach.in',
      },
    },
  };
};

module.exports = { generateCourseSeo };
