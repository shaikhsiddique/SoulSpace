import React, { useState } from 'react';
import { gsap } from 'gsap';

const PodcastCard = ({ podcast, index, isSuggested = false, userIssue }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = React.useRef(null);
  
  const matches = podcast.tags?.some(tag => 
    userIssue && tag.toLowerCase().includes(userIssue.toLowerCase())
  );

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(podcast.youtube_link);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

  const handleCardHover = (hover) => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: hover ? -5 : 0,
        scale: hover ? 1.02 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleWatchClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    
    // Animate modal opening
    setTimeout(() => {
      gsap.fromTo('.video-modal-content', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    }, 10);
  };

  const closeModal = () => {
    gsap.to('.video-modal-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => setShowModal(false)
    });
  };

  return (
    <>
      <div 
        ref={cardRef}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col ${
          isSuggested ? 'bg-gradient-to-br from-white via-white to-purple-50' : 'bg-white border border-gray-200'
        } ${matches ? 'border-2 border-purple-500 ring-4 ring-purple-100' : ''}`}
        style={{ transform: 'translateY(0)' }}
      >
        {matches && (
          <div className='absolute top-0 left-0 z-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium px-4 py-2 rounded-br-xl shadow-md'>
            <span className='flex items-center'>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Recommended for you
            </span>
          </div>
        )}
        
        {/* Video Thumbnail/Player Section */}
        <div className='relative group cursor-pointer' onClick={handleWatchClick}>
          <div className='h-48 bg-gradient-to-br from-gray-900 to-purple-900 relative overflow-hidden'>
            {thumbnailUrl ? (
              <>
                <img 
                  src={thumbnailUrl} 
                  alt={podcast.title}
                  className='w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
                
                {/* Play button overlay */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl'>
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className='absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded'>
                  {podcast.duration}
                </div>
              </>
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <svg className="w-16 h-16 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Hover effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
          
          {/* Title overlay on thumbnail */}
          <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent'>
            <h3 className='text-white font-bold text-sm line-clamp-2'>{podcast.title}</h3>
          </div>
        </div>
        
        {/* Content below thumbnail */}
        <div className='p-5 flex-grow'>
          {/* Tags */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {podcast.tags?.slice(0, 3).map((tag, tagIndex) => {
              const isMatch = tag.toLowerCase().includes(userIssue?.toLowerCase() || '');
              return (
                <span 
                  key={tagIndex}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isMatch 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform hover:scale-105'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          
          {/* Quick actions */}
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-4'>
              <button 
                onClick={handleWatchClick}
                className='flex items-center text-purple-600 hover:text-purple-700 font-medium'
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Now
              </button>
              <a
                href={podcast.youtube_link}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-500 hover:text-gray-700 flex items-center'
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Open
              </a>
            </div>
            
            <div className='flex items-center text-gray-500'>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {podcast.duration}
            </div>
          </div>
        </div>
        
        {/* Primary action button */}
        <div className='px-5 pb-5'>
          <button
            onClick={handleWatchClick}
            className='w-full text-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl shadow-md text-sm flex items-center justify-center group/btn'
          >
            <svg className="w-5 h-5 mr-2.5 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Watch Meditation
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="video-modal-content bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-800/50">
              <div>
                <h3 className="text-xl font-bold text-white">{podcast.title}</h3>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-sm text-purple-300">
                    <svg className="w-4 h-4 inline mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {podcast.duration}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {podcast.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-800/50 text-purple-200 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* YouTube Video Player */}
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {videoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={podcast.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-purple-800/50">
              <div className="flex justify-between items-center">
                <a
                  href={podcast.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-white flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Open on YouTube
                </a>
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastCard;