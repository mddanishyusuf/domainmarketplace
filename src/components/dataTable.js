// DomainTable.jsx
import React, { useState } from 'react';
import { LinkExternalLight, ArrowUpDown, ArrowUp, ArrowDown } from '@/lib/icons';
import Link from 'next/link';

const DomainTable = ({ initialDomains, owner }) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });

    const formatPrice = (price) => {
        if (price === null) return '-';
        return `$${price.toLocaleString()}`;
    };

    const sortData = (data, sortConfig) => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle special cases
            if (sortConfig.key === 'price') {
                aValue = aValue === null ? -1 : aValue;
                bValue = bValue === null ? -1 : bValue;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = null;
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="sort-icon" />;
        }
        return sortConfig.direction === 'ascending' ? <ArrowUp className="sort-icon active" /> : <ArrowDown className="sort-icon active" />;
    };

    const sortedDomains = sortData(initialDomains, sortConfig);

    const headers = [
        { key: 'domain', label: 'Domain' },
        { key: 'tld', label: 'TLD' },
        { key: 'price', label: 'Price' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="domain-table">
            <table>
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header.key}
                                onClick={() => requestSort(header.key)}
                                className={sortConfig.key === header.key ? 'sorted' : ''}
                            >
                                <div className="header-cell">
                                    <span>{header.label}</span>
                                    {getSortIcon(header.key)}
                                </div>
                            </th>
                        ))}
                        <th className="no-sort">Website</th>
                        {owner && <th className="no-sort">Owner</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedDomains.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <b style={{ fontSize: 16 }}>{item.domain}</b>
                            </td>
                            <td className="tld">{item.tld}</td>
                            <td>{formatPrice(item.price)}</td>
                            <td>
                                <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span>
                            </td>
                            <td>
                                <a
                                    href={item.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="website-link"
                                >
                                    Visit
                                    <LinkExternalLight className="external-icon" />
                                </a>
                            </td>
                            {owner && (
                                <td style={{ textDecoration: 'underline' }}>
                                    <Link href={`/${item.username}`}>{item.username}</Link>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DomainTable;
