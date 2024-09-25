import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import '/styles/Mayors.css';

interface Mayor {
  name: string;
  description: string;
  investmentIdeas: string[];
  type: 'regular' | 'special';
}

const mayors: Mayor[] = [
  {
    name: "Paul",
    description: "Increases dungeon rewards and reduces entry requirements.",
    investmentIdeas: [
      "Invest in dungeon gear and items",
      "Stock up on dungeon consumables",
      "Prepare to sell carry services"
    ],
    type: "regular"
  },
  {
    name: "Aatrox",
    description: "Boosts Slayer XP and reduces Slayer quest costs.",
    investmentIdeas: [
      "Stock up on Slayer-related items",
      "Prepare to sell Slayer carry services",
      "Invest in combat gear for Slayer quests"
    ],
    type: "regular"
  },
  {
    name: "Diana",
    description: "Introduces mythological creatures and excavation events.",
    investmentIdeas: [
      "Invest in Griffin Pet and related items",
      "Stock up on excavation tools",
      "Prepare to sell rare drops from mythological creatures"
    ],
    type: "regular"
  },
  {
    name: "Cole",
    description: "Boosts mining-related activities and introduces special mining events.",
    investmentIdeas: [
      "Invest in mining gear and tools",
      "Stock up on mining-related items",
      "Prepare to sell rare drops from special mining events"
    ],
    type: "regular"
  },
  {
    name: "Marina",
    description: "Enhances fishing activities and introduces special fishing events.",
    investmentIdeas: [
      "Invest in fishing gear and bait",
      "Stock up on fishing-related items",
      "Prepare to sell rare drops from special fishing events"
    ],
    type: "regular"
  },
  {
    name: "Foxy",
    description: "Introduces traveling merchants with special deals.",
    investmentIdeas: [
      "Save coins for potential good deals",
      "Be ready to quickly buy and resell valuable items",
      "Look for arbitrage opportunities between merchants and bazaar"
    ],
    type: "regular"
  },
  {
    name: "Diaz",
    description: "Reduces taxes on various transactions.",
    investmentIdeas: [
      "Prepare for increased trading activity",
      "Look for items with typically high taxes to flip",
      "Consider bulk buying/selling of high-volume items"
    ],
    type: "regular"
  },
  {
    name: "Finnegan",
    description: "Introduces Farming-related events and bonuses.",
    investmentIdeas: [
      "Invest in Farming tools and equipment",
      "Stock up on seeds and farming-related items",
      "Prepare to capitalize on increased crop prices"
    ],
    type: "regular"
  },
  {
    name: "Jerry",
    description: "Introduces various random events and bonuses.",
    investmentIdeas: [
      "Be prepared for anything",
      "Stock up on a variety of items",
      "Look for unique opportunities during Jerry's term"
    ],
    type: "special"
  },
  {
    name: "Derpy",
    description: "Doubles all skill XP gains, but disables the Auction House and Bazaar.",
    investmentIdeas: [
      "Stock up on items normally sold on AH/Bazaar",
      "Prepare skill-boosting items for sale",
      "Invest in minions that produce skill-related items"
    ],
    type: "special"
  },
  {
    name: "Scorpius",
    description: "Allows players to purchase special items with Dark Auctions.",
    investmentIdeas: [
      "Save up coins for Dark Auctions",
      "Research which items are likely to appear in Dark Auctions",
      "Prepare to resell valuable Dark Auction items"
    ],
    type: "special"
  }
];

const MayorCard: React.FC<Mayor> = ({ name, description, investmentIdeas, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <Card className={`mayor-card ${type}`}>
      <CardContent>
        <Typography variant="h5" component="h3" className="mayor-name">
          {name}
        </Typography>
        <Typography variant="body2" className="mayor-description">
          {description}
        </Typography>
        <Button onClick={toggleExpanded} className="toggle-button">
          {isExpanded ? 'Hide Ideas' : 'Show Investment Ideas'}
        </Button>
        <div 
          className={`investment-ideas ${isExpanded ? 'expanded' : ''}`}
          ref={contentRef}
          style={isExpanded ? { maxHeight: contentRef.current?.scrollHeight + 'px' } : {}}
        >
          <ul>
            {investmentIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const Mayors: React.FC = () => {
  const regularMayors = mayors.filter(mayor => mayor.type === 'regular');
  const specialMayors = mayors.filter(mayor => mayor.type === 'special');

  return (
    <div className="mayors">
      <h2 className="mayors-title">Mayors</h2>
      <div className="mayors-columns">
        <div className="mayors-column">
          <h3 className="column-title">Regular Mayors</h3>
          {regularMayors.map((mayor) => (
            <MayorCard key={mayor.name} {...mayor} />
          ))}
        </div>
        <div className="mayors-column">
          <h3 className="column-title">Special Mayors</h3>
          {specialMayors.map((mayor) => (
            <MayorCard key={mayor.name} {...mayor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mayors;