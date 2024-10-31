"use client";

import { useState, type FormEvent } from "react";

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) return alert("Please provide a valid amazon link");

    try {
      setIsLoading(true);
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
        placeholder="Entrer product link"
        className="searchbar-input"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Search..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
