const clientId = '043208dce5dc434fb371a8277eab5c77';
const redirectUri = 'http://localhost:3000/';

let accessToken;

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken
		}

		//check for acces token match
		const accessTokenFetch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (accessTokenFetch && expiresInMatch) {
			accessToken = accessTokenFetch[1];
			const expiresIn = Number(expiresInMatch[1]);

			//  clear parameters
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
		}
	},

	search(term) {
		if(!term) {
			alert('Please refresh browser');
		};
		const accessToken = Spotify.getAccessToken();
		 return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}})
		 .then(response => {
		 	if (response.ok) {
		 		return response.json();
		 	};     
		 	
		 }).then(jsonResponse => {
		 	if (!jsonResponse.tracks) {
		 		return [];
		 	};
		 	return jsonResponse.tracks.items.map(track => ({
		 		id: track.id,
		 		name: track.name,
		 		artist: track.artists[0].name,
		 		album: track.album.name,
		 		uri: track.uri,
		 		preview_url: track.preview_url
		 	}));
		 });
	},

	savePlaylist(playlistName, trackUri) {
        if (!playlistName || !trackUri.length) {
        	return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
        	Authorization: `Bearer ${accessToken}`, 
        };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => {
        		return response.json();
        }).then(jsonResponse => {
        	userId = jsonResponse.id;
        	
        	return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        		headers: headers,
            	method: 'POST',
            	body: JSON.stringify({name: playlistName})
        	}).then(response => response.json()
        	).then(jsonResponse => {
        		
        		const playlistId =  jsonResponse.id;

        		return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        			headers: headers,
        			method: 'POST',
        			body: JSON.stringify({uris: trackUri})
        		 })
        	});
        })
	}
};

export default Spotify;