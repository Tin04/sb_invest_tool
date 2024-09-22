import React, { useMemo } from 'react';
import '/styles/style.css';

interface Item {
  itemTag: string;
  quantity: number;
  avgCost: number;
  profit: number;
  price: number;
}

const ItemList = React.memo(({ items }: { items: Record<string, Item>[] }) => {
  const itemEntries = Object.entries(items);

  if (itemEntries.length === 0) {
    return <div>No items to display.</div>;
  }
  return (
      <table id="item-list">
        <thead>
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Average Cost</th>
            <th>Quantity</th>
        </tr>
        </thead>
        <tbody>
          {itemEntries.map(([key, item]) => (
                <tr key={key}
                  className={
                    item.price > item.avgCost
                      ? 'highlight-green'
                      : item.price < item.avgCost
                      ? 'highlight-red'
                      : 'highlight-white'
                  }
                >
                <td>{key}</td>
                <TableCell item={item} attribute="price" />
                <TableCell item={item} attribute="avgCost" />
                <TableCell item={item} attribute="quantity" />
              </tr>
          ))}
      </tbody>
      </table>
  );
});

// Memoize the table cell, so no need update whole table when attribute changes
const TableCell = React.memo(({ item, attribute }: { item: Record<string, any>, attribute: string }) => {
  const value = useMemo(() => item[attribute], [item, attribute]);

  return <td>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>;
});

export default ItemList;