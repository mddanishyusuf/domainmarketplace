import path from 'path';
import fsPromises from 'fs/promises';
import DomainTable from '@/components/dataTable';

export default function UserPage({ domains, username, fullName, contact }) {
    return (
        <div className="main-container">
            <h2>{fullName}</h2>
            <p>
                I currently manage a portfolio of {domains.length} domains, with <b>{domains.filter((x) => x.status === 'For Sale').length}</b> listed for sale and available for acquisition.
            </p>
            <p>
                <b>Contact</b>: {contact}
            </p>
            <br />
            <DomainTable initialDomains={domains} />
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const { username } = context.query;
    const filePath = path.join(process.cwd(), `src/data/${username}.json`);
    const jsonData = await fsPromises.readFile(filePath);
    const domainData = JSON.parse(jsonData);
    const { domains, name, contact } = domainData;

    return {
        props: {
            domains,
            username,
            fullName: name,
            contact,
        },
    };
};
