import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Collapse } from '@mui/material';

interface Mayor {
  name: string;
  description: string;
  investmentIdeas: string[];
}

const mayors: Mayor[] = [
  {
    name: "Derpy",
    description: "Doubles all skill XP gains, but disables the Auction House and Bazaar.",
    investmentIdeas: [
      "Stock up on items normally sold on AH/Bazaar",
      "Prepare skill-boosting items for sale",
      "Invest in minions that produce skill-related items"
    ]
  },
  {
    name: "Paul",
    description: "Increases dungeon rewards and reduces entry requirements.",
    investmentIdeas: [
      "Invest in dungeon gear and items",
      "Stock up on dungeon consumables",
      "Prepare to sell carry services"
    ]
  },
  // Add more mayors here...
];

const MayorCard: React.FC<Mayor> = ({ name, description, investmentIdeas }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide Ideas' : 'Show Investment Ideas'}
        </Button>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" component="ul">
            {investmentIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </Typography>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const Mayors: React.FC = () => {
  return (
    <div>
      {mayors.map((mayor, index) => (
        <MayorCard key={index} {...mayor} />
      ))}
    </div>
  );
};

export default Mayors;