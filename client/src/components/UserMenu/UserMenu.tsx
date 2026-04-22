import './UserMenuStyle.css';
import { UserProfile } from '../../main.tsx';

export interface UserMenuProps {
  data?: UserProfile['data'];
}

export function UserMenu({ data }: UserMenuProps) {
  console.log('dataAA');
  console.log(data);
  return (
    <section id="profile">
      <h1>Minha conta:</h1>
      {data ? (
        <div>
          <p>Display Name: {data.display_name}</p>
          <p>Email: {data.email}</p>
          <p>URI: {data.uri}</p>
          <p>
            Spotify URL:{' '}
            <a href={data.external_urls?.spotify} target="_blank" rel="noopener noreferrer">
              {data.external_urls?.spotify}
            </a>
          </p>
          <p>
            Profile URL:{' '}
            <a href={data.href} target="_blank" rel="noopener noreferrer">
              {data.href}
            </a>
          </p>
          {data?.images && data.images.length > 0 ? (
            <img src={data.images[0].url} alt="Profile" width={200} height={200} />
          ) : (
            <p>No profile image available.</p>
          )}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </section>
  );
}

export default UserMenu;
