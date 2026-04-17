import './UserMenuStyle.css';
import { UserProfile } from '../../main.tsx';

export function UserMenu({ data }: UserProfile) {
  return (
    <section id="profile">
      <h1>Minha conta:</h1>
      <h2>
        Logado como <span id="displayNames">{data?.display_name || 'Carregando...'}</span>
      </h2>
      {data?.user_profile_image ? (
        <img id="avatar" src={data.user_profile_image} alt="Profile Avatar" width="100" />
      ) : (
        <p>Carregando imagem...</p>
      )}
      <ul>
        <li>
          User ID: <span id="id">{data?.user_id || 'Carregando...'}</span>
        </li>
        <li>
          E-mail: <span id="email">{data?.user_email || 'Carregando...'}</span>
        </li>
        <li>
          Spotify URI:{' '}
          <a id="uri" href={data?.user_uri}>
            {data?.user_uri || 'Carregando...'}
          </a>
        </li>
        <li>
          Link:{' '}
          <a id="url" href={data?.user_spotify_link}>
            {data?.user_spotify_link || 'Carregando...'}
          </a>
        </li>
      </ul>
    </section>
  );
}

export default UserMenu;
