import React, { useMemo } from 'react';
import '/styles/style.css';

interface Item {
  itemName: string;
  quantity: number;
  avgCost: number;
  profit: number;
  price: number;
}

const ItemList = React.memo(({ items }: { items: Record<string, Item> }) => {
  const itemEntries = Object.entries(items);

  if (itemEntries.length === 0) {
    return <div>No items to display.</div>;
  }
  return (
    <table id="item-list">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Price</th>
          <th>Average Cost</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {itemEntries.map(([itemTag, item]) => (
          <tr key={itemTag}
            className={
              item.price > item.avgCost
                ? 'highlight-green'
                : item.price < item.avgCost
                  ? 'highlight-red'
                  : 'highlight-white'
            }
          >
            <td>{item.itemName}</td>
            <TableCell item={item} attribute="price" />
            <TableCell item={item} attribute="avgCost" />
            <TableCell item={item} attribute="quantity" />
          </tr>
        ))}
      </tbody>
    </table>
  );
});

// Memoize the table cell, so no need to update the whole table when an attribute changes
const TableCell = React.memo(({ item, attribute }: { item: Record<string, any>, attribute: string }) => {
  const value = useMemo(() => item[attribute], [item, attribute]);

  return <td>{value !== undefined && value !== null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}</td>;
});

export default ItemList;