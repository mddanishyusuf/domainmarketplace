import path from 'path';
import fsPromises from 'fs/promises';
import DomainTable from '@/components/dataTable';

export default function Home({ domains }) {
    return (
        <div className="main-container">
            <h2 className="margin-0">Domain Marketplace</h2>
            <p style={{ maxWidth: 500, color: '#666' }}>This is a place where you can find domains that are available to sale and also create your domain profile.</p>
            <button className="button button--primary">Create Your Domain Profile</button>
            <br />
            <br />
            <DomainTable
                initialDomains={domains}
                owner
            />
        </div>
    );
}

export const getServerSideProps = async () => {
    const dataDir = path.join(process.cwd(), 'src/data');
    const files = await fsPromises.readdir(dataDir); // Get all filenames in the data directory
    let allDomains = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            // Ensure only JSON files are processed
            const username = file.replace('.json', ''); // Extract the username from the file name
            const filePath = path.join(dataDir, file);
            const jsonData = await fsPromises.readFile(filePath, 'utf8');
            const domainData = JSON.parse(jsonData);

            if (domainData.domains && Array.isArray(domainData.domains)) {
                allDomains = [
                    ...allDomains,
                    ...domainData.domains
                        .filter((domain) => domain.status === 'For Sale') // Filter for "For Sale" status
                        .map((domain) => ({ ...domain, username })), // Add the username key
                ];
            }
        }
    }

    return {
        props: {
            domains: allDomains,
        },
    };
};
