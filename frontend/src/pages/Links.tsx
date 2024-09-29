import React from 'react';
import '../styles/style.css';

const Links: React.FC = () => {
  return (
    <div className="links-container">
        <h1>Useful Skyblock Data Tracking Websites</h1>
        
        <div className="link-category">
            <h2>Economy Trackers</h2>
            <ul className="link-list">
                <li>
                    <a href="https://sky.coflnet.com/" target="_blank" rel="noopener noreferrer">Coflnet</a>
                    <p className="link-description">Browse through over 600 million auctions, over two million players and the bazaar of hypixel skyblock</p>
                </li>
                <li>
                    <a href="https://www.brandonfowler.me/skyblockah/" target="_blank" rel="noopener noreferrer">Skyblock AH - Brandon Fowler</a>
                    <p className="link-description">Hypixel SkyBlock Auction House</p>
                </li>
                <li>
                    <a href="https://skyblock.finance/" target="_blank" rel="noopener noreferrer">Skyblock Finance</a>
                    <p className="link-description">Bazaar Tracker with price charts using TradingView library, flip ideas</p>
                </li>
                <li>
                    <a href="https://www.skyblock.bz/" target="_blank" rel="noopener noreferrer">SkyBlock.bz</a>
                    <p className="link-description">Bazaar Tracker targeting flippers</p>
                </li>
                <li>
                    <a href="https://bazaartracker.com/" target="_blank" rel="noopener noreferrer">Bazaar Tracker</a>
                    <p className="link-description">Tracks Hypixel Skyblock Bazaar prices and provides market analysis tools.</p>
                </li>
            </ul>
        </div>

        <div className="link-category">
            <h2>Item and Collection Guides</h2>
            <ul className="link-list">
                <li>
                    <a href="https://hypixel-skyblock.fandom.com/wiki/Hypixel_SkyBlock_Wiki" target="_blank" rel="noopener noreferrer">Hypixel Skyblock Wiki</a>
                    <p className="link-description">Extensive wiki with information on items, collections, and game mechanics.</p>
                </li>
                <li>
                    <a href="https://sky.shiiyu.moe/" target="_blank" rel="noopener noreferrer">SkyCrypt</a>
                    <p className="link-description">Player stats viewer with detailed information on collections, skills, and more.</p>
                </li>
            </ul>
        </div>

        <div className="link-category">
            <h2>Community Resources</h2>
            <ul className="link-list">
                <li>
                    <a href="https://hypixel.net/forums/skyblock.157/" target="_blank" rel="noopener noreferrer">Hypixel Skyblock Forums</a>
                    <p className="link-description">Official forums for Hypixel Skyblock with discussions, guides, and updates.</p>
                </li>
                <li>
                    <a href="https://www.reddit.com/r/HypixelSkyblock/" target="_blank" rel="noopener noreferrer">Hypixel Skyblock Subreddit</a>
                    <p className="link-description">Reddit community for Hypixel Skyblock with user-generated content and discussions.</p>
                </li>
            </ul>
        </div>
    </div>
  );
};

export default Links;