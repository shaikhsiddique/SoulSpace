import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import booksData from '../resources.json';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { gsap } from 'gsap';
import PodcastCard from '../components/PoadCastCard';
import BookCard from '../components/BookCard';


function BookPodcast() {
  const [activeTab, setActiveTab] = useState('books');
  const { user } = useContext(UserContext);
  const [userIssue, setUserIssue] = useState('');
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const tabsRef = useRef(null);
  
  // Get all categories from booksData
  const allCategories = booksData.books;
  const allPodcasts = booksData.podcasts || [];

  // Extract user's emotional issue when user context updates
  useEffect(() => {
    if (user && user.tests && user.tests.length > 0) {
      const lastTest = user.tests[user.tests.length - 1];
      if (lastTest.emotion) {
        setUserIssue(lastTest.emotion.toLowerCase());
      }
    }
  }, [user]);

  // Helper function to filter items by user issue
  const filterItemsByIssue = (items, tagsField = 'tags') => {
    if (!userIssue || !items || items.length === 0) {
      return items || [];
    }

    // Filter items that have a tag matching the user's issue
    const filteredItems = items.filter(item => 
      item[tagsField] && 
      item[tagsField].some(tag => 
        tag.toLowerCase().includes(userIssue.toLowerCase())
      )
    );
    
    // If we don't have enough items matching the exact issue, include related ones
    if (filteredItems.length < Math.min(3, items.length)) {
      const relatedItems = items.filter(item => 
        !filteredItems.includes(item) && 
        item[tagsField] &&
        item[tagsField].some(tag => {
          // Define related emotions based on common mental health categories
          const relatedEmotions = {
            'angry': ['anger', 'frustration', 'stress', 'rage', 'irritated'],
            'anxious': ['anxiety', 'stress', 'worry', 'panic', 'nervous'],
            'depressed': ['depression', 'sadness', 'grief', 'hopeless', 'low'],
            'stressed': ['stress', 'anxiety', 'burnout', 'overwhelmed', 'pressure'],
            'sad': ['sadness', 'grief', 'depression', 'unhappy', 'melancholy'],
            'lonely': ['loneliness', 'isolation', 'connection', 'alone', 'solitude']
          };
          
          const related = relatedEmotions[userIssue] || [];
          return related.some(relatedTag => 
            tag.toLowerCase().includes(relatedTag.toLowerCase())
          );
        })
      );
      
      // Combine exact matches and related items
      return [...filteredItems, ...relatedItems].slice(0, Math.min(6, items.length));
    }
    
    return filteredItems;
  };

  // Flatten all books from all categories for filtering
  const allBooks = useMemo(() => 
    allCategories.flatMap(category => category.books),
    [allCategories]
  );

  // Get suggested books based on user's issue
  const suggestedBooks = useMemo(() => {
    const filtered = filterItemsByIssue(allBooks, 'tags');
    return filtered.slice(0, 3);
  }, [allBooks, userIssue]);

  // Get suggested podcasts based on user's issue
  const suggestedPodcasts = useMemo(() => {
    const filtered = filterItemsByIssue(allPodcasts, 'tags');
    return filtered.slice(0, 3);
  }, [allPodcasts, userIssue]);

  // Animation for content switching
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  // Animation for cards
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: "back.out(1.2)"
            }
          );
        }
      });
    }
  }, [suggestedBooks, suggestedPodcasts, activeTab]);

  // Animation for tab switching
  const handleTabChange = (tab) => {
    if (tabsRef.current) {
      gsap.to(tabsRef.current.querySelectorAll('button'), {
        scale: 0.95,
        duration: 0.2,
        onComplete: () => {
          setActiveTab(tab);
          gsap.to(tabsRef.current.querySelectorAll('button'), {
            scale: 1,
            duration: 0.2
          });
        }
      });
    } else {
      setActiveTab(tab);
    }
  };



  return (
    <div className='min-h-screen bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] px-4 py-6'>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-40'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            Mental Wellness Resources
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto text-lg mb-8'>
            Discover helpful books and podcasts to support your mental health journey.
          </p>
          
          {/* Personalization badge */}
          {userIssue && (
            <div className='inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-full mb-6 shadow-lg animate-pulse-slow'>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Personalized for: {userIssue.charAt(0).toUpperCase() + userIssue.slice(1)}
            </div>
          )}
          
          {/* Tab Navigation */}
          <div ref={tabsRef} className='inline-flex rounded-2xl border-2 border-gray-200 bg-white p-1.5 shadow-md mb-8'>
            <button
              onClick={() => handleTabChange('books')}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === 'books'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Books
            </button>
            <button
              onClick={() => handleTabChange('podcasts')}
              className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center ${
                activeTab === 'podcasts'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Podcasts
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div ref={contentRef}>
          {activeTab === 'books' ? (
            <div className='space-y-12'>
              {/* Suggested Books Section */}
              {suggestedBooks.length > 0 && (
                <div className='mb-12'>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Suggested For You</h2>
                      <p className='text-gray-600'>
                        {userIssue 
                          ? `Books to help with ${userIssue}`
                          : 'Top picks based on your interests'}
                      </p>
                    </div>
                    {userIssue && (
                      <div className='text-sm bg-blue-50 text-blue-700 font-medium px-4 py-2 rounded-full'>
                        Matching: {userIssue}
                      </div>
                    )}
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {suggestedBooks.map((book, index) => 
                      <BookCard
                      key={book.book_id || book.id}
                      book={book}
                      index={index}
                      isSuggested={true}
                      userIssue={userIssue}
                    />
                    )}
                  </div>
                </div>
              )}

              {/* All Categories Section */}
              <div className='space-y-10'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Browse by Category</h2>
                
                {allCategories.map((category) => (
                  <div key={category.category_id} className='bg-white rounded-2xl shadow-lg p-6'>
                    <div className='mb-6'>
                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-xl font-bold text-gray-800'>{category.category_name}</h3>
                        <span className='text-sm text-gray-500'>{category.books.length} books</span>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {category.mapped_tags?.map((tag, index) => {
                          const isMatch = userIssue && tag.toLowerCase().includes(userIssue.toLowerCase());
                          return (
                            <span 
                              key={index}
                              className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                                isMatch 
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                      {category.books.map((book, index) => 
                        <BookCard
                        key={book.book_id || book.id}
                        book={book}
                        index={index}
                        isSuggested={false}
                        userIssue={userIssue}
                      />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Podcasts Section */
            <div className='space-y-12'>
              {/* Suggested Podcasts Section */}
              {suggestedPodcasts.length > 0 && (
                <div className='mb-12'>
                  <div className='flex items-center justify-between mb-6'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-800 mb-2'>Suggested For You</h2>
                      <p className='text-gray-600'>
                        {userIssue 
                          ? `Podcasts to help with ${userIssue}`
                          : 'Top picks based on your interests'}
                      </p>
                    </div>
                    {userIssue && (
                      <div className='text-sm bg-purple-50 text-purple-700 font-medium px-4 py-2 rounded-full'>
                        Matching: {userIssue}
                      </div>
                    )}
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {suggestedPodcasts.map((podcast, index) => 
                     <PodcastCard
                     key={podcast.id}
                     podcast={podcast}
                     index={index}
                     isSuggested={true}
                     userIssue={userIssue}
                   />
                    )}
                  </div>
                </div>
              )}

              {/* All Podcasts Section */}
              <div className='space-y-10'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>All Podcasts</h2>
                  <span className='text-sm text-gray-500'>{allPodcasts.length} episodes</span>
                </div>
                
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {allPodcasts.map((podcast, index) => 
                       <PodcastCard
                       key={podcast.id}
                       podcast={podcast}
                       index={index}
                       isSuggested={false}
                       userIssue={userIssue}
                     />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}

export default BookPodcast;