"use client";

import {  SocialProfile } from "thirdweb/react";
import { useEffect, useState } from "react";
import { getSocialProfiles } from "thirdweb/social";
import { client } from "./client";
import { shortenAddress } from "thirdweb/utils";
import { CardSkeleton } from "./components/CardSkeleton";
import { ENSCard } from "./components/ENSCard";
import { FarcasterCard } from "./components/FarcasterCard";
import { LensCard } from "./components/LensCard";


type FilterType = "all" | "ens" | "farcaster" | "lens";

const isValidEthereumAddress = (address: string)=>{
  return /^0x[a-fA-f0-9]{40}$/.test(address);
}

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedAddress, setSearchAddress] = useState("");
  const [userProfiles, setUserProfiles] = useState<SocialProfile[]>([]);
  const [activefilter, setActiveFilter] = useState<FilterType>("all");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);

  useEffect(()=>{
    setIsValidAddress(isValidEthereumAddress(searchInput));
  },[searchInput]);

  const handleSearch = async() => {
    if(!isValidAddress) return; // chech wheater address is correct
    setLoading(true);
    setSearchAddress(searchInput);
  try {
    const profiles = await getSocialProfiles({ // geting our social profiles
      client: client,
      address: searchInput
    });

    setUserProfiles(profiles);
    setHasSearched(true);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
    setSearchInput("")
  }
};


const filteredProfiles = userProfiles.filter(profile =>
  activefilter === "all" || profile.type === activefilter
);


  return (
      <main className="min-h-screen bg-base-950 flex flex-col items-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-8 text-neutral-200">WYA WEB5</h1>
          <h2 className="text-2xl font-medium mb-6 text-neutral-400">Find ENS, Farcaster, and Lens profiles.</h2>



          <div className="flex flex-row items-center justify-center mb-4">
          <input
            type="text"
            placeholder="Enter wallet address"
            className={`bg-zinc-800 text-neutral-200 border border-zinc-700 rounded-md px-4 py-2 ${!isValidAddress && searchInput ? 'input-error' : ''}`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 mx-3 rounded-md hover:bg-blue-700" 
            onClick={handleSearch}
            disabled={isLoading || !isValidAddress}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
        { searchInput && !isValidAddress && (
          <p className="text-red-500 text-xs text-left mt-1">please enter a valid eth address</p>
        )}

{hasSearched && (
          <>
            <p className="text-sm text-gray-400 mb-4">Search results for: {shortenAddress(searchedAddress)}</p>
            <div className="flex space-x-2 bg-zinc-800 p-1 rounded-lg">
              {["all", "ens", "farcaster", "lens"].map((filter) => (
                <a
                  key={filter}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activefilter === filter ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-zinc-700 hover:text-white"}`}
                  onClick={() => setActiveFilter(filter as FilterType)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </a>
              ))}
            </div>
          </>
        )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => <CardSkeleton key={index} />)
        ) : hasSearched && filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, index) => (
            <div key={index} className="w-full h-full">
              {profile.type === "ens" && <ENSCard profile={profile} />}
              {profile.type === "farcaster" && <FarcasterCard profile={profile} />}
              {profile.type === "lens" && <LensCard profile={profile} />}
            </div>
          ))
        ) : hasSearched ? (
          <p className="text-center text-gray-500 col-span-full">No profiles found for this address.</p>
        ) : null}
      </div>

      </main>
  );
}
