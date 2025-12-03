// components/BookCard.jsx
import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

const BookCard = ({ book, index, isSuggested = false, userIssue }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef(null);
  const previewRef = useRef(null);
  
  const matches = book.tags?.some(tag => 
    userIssue && tag.toLowerCase().includes(userIssue.toLowerCase())
  );

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

  const handleReadClick = (e) => {
    e.preventDefault();
    
    // If it's a PDF link, show preview modal
    if (book.pdf_link && (book.pdf_link.endsWith('.pdf') || book.pdf_link.includes('pdf'))) {
      setShowModal(true);
      
      // Animate modal opening
      setTimeout(() => {
        gsap.fromTo('.book-modal-content', 
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      }, 10);
    } else {
      // Open external link in new tab
      window.open(book.pdf_link, '_blank');
    }
  };

  const handleImageHover = (hover) => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        scale: hover ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const closeModal = () => {
    gsap.to('.book-modal-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => setShowModal(false)
    });
  };

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = book.pdf_link;
    link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div 
        ref={cardRef}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col ${
          isSuggested ? 'bg-gradient-to-br from-white via-white to-blue-50' : 'bg-white border border-gray-200'
        } ${matches ? 'border-2 border-blue-500 ring-4 ring-blue-100' : ''}`}
        style={{ transform: 'translateY(0)' }}
      >
        {matches && (
          <div className='absolute top-0 left-0 z-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-4 py-2 rounded-br-xl shadow-md'>
            <span className='flex items-center'>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Recommended for you
            </span>
          </div>
        )}
        
        {/* Book Cover Section */}
        <div 
          className='relative group cursor-pointer'
          onMouseEnter={() => handleImageHover(true)}
          onMouseLeave={() => handleImageHover(false)}
          onClick={() => setShowPreview(!showPreview)}
        >
          <div className={`h-56 flex items-center justify-center p-6 ${
            isSuggested 
              ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100' 
              : 'bg-gradient-to-br from-gray-50 to-blue-50'
          }`}>
            <img 
              ref={previewRef}
              src={book.cover_image} 
              alt={book.title}
              className='max-h-48 max-w-48 object-contain shadow-lg transition-transform duration-300'
              style={{ transform: 'scale(1)' }}
            />
            
            {/* Preview overlay */}
            {showPreview && (
              <div className='absolute inset-0 bg-black/70 flex items-center justify-center p-4'>
                <div className='bg-white rounded-lg p-4 max-w-xs'>
                  <p className='text-sm text-gray-700 mb-2'>{book.summary}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReadClick(e);
                    }}
                    className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                  >
                    Read full book →
                  </button>
                </div>
              </div>
            )}
            
            {/* Hover effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
          
          {/* Quick preview button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(!showPreview);
            }}
            className='absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center transition-all duration-200'
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {showPreview ? 'Hide' : 'Preview'}
          </button>
        </div>
        
        {/* Book Content */}
        <div className='p-5 flex-grow'>
          <h3 className='text-lg font-bold text-gray-800 mb-2 line-clamp-1'>{book.title}</h3>
          <p className='text-gray-500 text-sm mb-3 flex items-center'>
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            by {book.author}
          </p>
          
          <p className='text-gray-700 text-sm mb-4 line-clamp-2'>{book.summary}</p>
          
          {/* Tags */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {book.tags?.slice(0, 4).map((tag, tagIndex) => {
              const isMatch = tag.toLowerCase().includes(userIssue?.toLowerCase() || '');
              return (
                <span 
                  key={tagIndex}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isMatch 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform hover:scale-105'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  {tag}
                  {isMatch && (
                    <span className='ml-1'>✓</span>
                  )}
                </span>
              );
            })}
          </div>
          
          {/* Quick Stats */}
          <div className='flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100'>
            <div className='flex items-center'>
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              E-Book
            </div>
            <div className='flex items-center'>
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              PDF Available
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className='px-5 pb-5'>
          <button
            onClick={handleReadClick}
            className='w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl shadow-md text-sm flex items-center justify-center group/btn mb-3'
          >
            <svg className="w-5 h-5 mr-2.5 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Read Book
          </button>
          
          <div className='flex gap-2'>
            <button
              onClick={handleDownload}
              className='flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center'
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className='flex-1 text-center border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm flex items-center justify-center'
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Book Preview/Reading Modal */}
      {showModal && book.pdf_link && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="book-modal-content bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center space-x-4">
                <img 
                  src={book.cover_image} 
                  alt={book.title}
                  className="w-12 h-16 object-contain shadow-md rounded"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
                  <p className="text-gray-600 text-sm">by {book.author}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={book.pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Open Full
                </a>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="h-[calc(90vh-180px)] p-4 bg-gray-50">
              <div className="h-full w-full bg-white rounded-lg shadow-inner overflow-hidden">
                {book.pdf_link && (
                  <iframe
                    src={book.pdf_link}
                    title={`${book.title} - PDF Viewer`}
                    className="w-full h-full"
                    frameBorder="0"
                  />
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {book.tags?.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={closeModal}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;