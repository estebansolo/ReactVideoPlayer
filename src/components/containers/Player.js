import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Video from '../Video';
import Playlist from '../containers/Playlist';
import StyledPlayer from '../styles/StyledPlayer';
import playlistVideos from '../../playlist.json';

const themeNight = {
	shadow: '#000000',
	bgcolorItem: '#414141',
	bgcolorItemActive: '#eeeeee',
	bgcolorPlayed: '#526d4e',
	bgcolor: '#0b1319',
	activeColor: '#0b1319',
	color: '#ffffff'
};

const themeLight = {
	shadow: '#FFFFFF',
	bgcolorItem: '#ffffff',
	bgcolorItemActive: '#555555',
	bgcolorPlayed: '#7d9979',
	bgcolor: '#efefef',
	activeColor: '#FFFFFF',
	color: '#000'
};

const Player = (props) => {
	const videos = playlistVideos;
	const activeVideo = props.match.params.activeVideo;
	const savedState = JSON.parse(localStorage.getItem(`${videos.playlistId}`));

	const [ state, setState ] = useState({
		autoplay: false,
		videos: videos.playlist,
		playlistId: videos.playlistId,
		nightMode: savedState ? savedState.nightMode : true,
		activeVideo: savedState ? savedState.activeVideo : videos.playlist[0]
	});

	useEffect(
		() => {
			localStorage.setItem(`${state.playlistId}`, JSON.stringify({ ...state }));
		},
		[ state ]
	);

	useEffect(
		() => {
			const videoId = props.match.params.activeVideo;
			if (videoId !== undefined) {
				const newActiveVideo = state.videos.findIndex((video) => video.id === videoId);

				setState({
					...state,
					activeVideo: state.videos[newActiveVideo],
					autoplay: props.location.autoplay
				});
			} else {
				props.history.push({
					pathname: `/${state.activeVideo.id}`,
					autoplay: false
				});
			}
		},
		[ activeVideo ]
	);

	const nightModeCallback = () => {
		setState((prevState) => ({
			...prevState,
			nightMode: !prevState.nightMode
		}));
	};

	const endCallback = () => {
		const videoId = props.match.params.activeVideo;
		const currentVideoIndex = state.videos.findIndex((video) => video.id === videoId);
		const nextVideo = currentVideoIndex === state.videos.length - 1 ? 0 : currentVideoIndex + 1;

		props.history.push({
			pathname: `/${state.videos[nextVideo].id}`,
			autoplay: false
		});
	};

	const progressCallback = (e) => {
		if (e.playedSeconds > 10 && e.playedSeconds < 11) {
			setState((prevState) => ({
				...prevState,
				videos: state.videos.map(
					(video) => (video.id === state.activeVideo.id ? { ...video, played: true } : video)
				)
			}));
		}
	};

	return (
		<ThemeProvider theme={state.nightMode ? themeNight : themeLight}>
			{state.videos !== null ? (
				<StyledPlayer>
					<h1 className="Player__Title">Simple React Video Player</h1>
					<div className="Player__Wrapper">
						<Video
							active={state.activeVideo}
							autoplay={state.autoplay}
							endCallback={endCallback}
							progressCallback={progressCallback}
						/>
						<Playlist
							videos={state.videos}
							active={state.activeVideo}
							nightModeCallback={nightModeCallback}
							nightMode={state.nightMode}
						/>
					</div>
				</StyledPlayer>
			) : null}
		</ThemeProvider>
	);
};

export default Player;
