
import React from 'react';
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE_URL, SOCIAL_LINKS, APP_SLOGAN } from '../constants';

// Basic SVG icons for social media
const LinkedInIcon = () => <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>;
const TwitterIcon = () => <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>;
const InstagramIcon = () => <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>;
const GitHubIcon = () => <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.514-4.486-10-10-10z"></path></svg>;
const YouTubeIcon = () => <svg fill="currentColor" stroke="none" className="w-5 h-5" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.006V8.994l5.207,3.006L9.996,15.006z"></path></svg>;
const BlogIcon = () => <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M4 20h4v-4H4zM4 12h16M4 4h16"></path></svg>;


export const Footer: React.FC = () => {
  return (
    <footer className="hnai-teal-bg text-hnai-light-text pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="text-lg font-semibold text-hnai-yellow mb-3">HERE AND NOW AI</h5>
            <p className="text-sm">Artificial Intelligence Research Institute</p>
            <p className="text-sm mt-2">{APP_SLOGAN}</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-hnai-yellow mb-3">Contact Us</h5>
            <p className="text-sm">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-hnai-yellow transition-colors">{CONTACT_EMAIL}</a></p>
            <p className="text-sm">Phone: <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-hnai-yellow transition-colors">{CONTACT_PHONE}</a></p>
            <p className="text-sm">Website: <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors">{WEBSITE_URL}</a></p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-hnai-yellow mb-3">Follow Us</h5>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><LinkedInIcon/></a>
              <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><TwitterIcon/></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><InstagramIcon/></a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><GitHubIcon/></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><YouTubeIcon/></a>
              <a href={SOCIAL_LINKS.blog} target="_blank" rel="noopener noreferrer" className="hover:text-hnai-yellow transition-colors"><BlogIcon/></a>
            </div>
          </div>
        </div>
        <div className="border-t border-hnai-yellow/30 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} HERE AND NOW AI. All rights reserved. Social Pulse App.
          <br />
          Developed by Arlin Robeiksha Britto [ AI Products Engineering Team]
        </div>
      </div>
    </footer>
  );
};
