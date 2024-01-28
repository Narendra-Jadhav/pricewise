"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { useState } from "react";

//? for activity on client side, for using states, hooks we make it client side
//* as there is a onSubmit parameter in the form and it is on the client side.
//* So, if we need interactivity, consider converting part of this to Client Component. Hence we used "use client" directive at the top

const isValidAmazonProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        if (
            hostname.includes('amazon.com') ||
            hostname.includes('amazon.') ||
            hostname.includes('amazon')
        ) {
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}

const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //* It is TypeScript so specifying the datatype of event
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert('Please provide a valid Amazon link');

    try {
        setIsLoading(true);

        //* Scrape the product page
        const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
