import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoCall = () => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    // Access user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;

        // Listen for a call from another user
        socket.on("callUser", (data) => {
          handleReceiveCall(data, stream);
        });
      })
      .catch((err) => {
        console.error("Error accessing user media:", err);
      });

    return () => {
      socket.off("callUser");
    };
  }, []);

  const handleReceiveCall = (data, stream) => {
    // Create a peer connection
    peerRef.current = createPeer(data.signal, stream);
    setIsCalling(true);
  };

  const createPeer = (incomingSignal, stream) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    // Add local stream to peer connection
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    // Listen for remote stream from peer
    peer.ontrack = (event) => {
      partnerVideo.current.srcObject = event.streams[0];
    };

    // Set remote description and create an answer to the incoming call
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", {
          candidate: event.candidate,
        });
      }
    };

    peer.setRemoteDescription(new RTCSessionDescription(incomingSignal)).then(
      () => {
        peer.createAnswer().then((answer) => {
          peer.setLocalDescription(answer).then(() => {
            socket.emit("answerCall", { signal: peer.localDescription });
          });
        });
      }
    );

    return peer;
  };

  const handleCallUser = (id) => {
    // Start a call with another user
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", {
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      partnerVideo.current.srcObject = event.streams[0];
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        peerRef.current = peer;

        peer.createOffer().then((offer) => {
          peer.setLocalDescription(offer).then(() => {
            socket.emit("callUser", { signal: peer.localDescription, to: id });
          });
        });
      });
  };

  const handleAnswer = () => {
    setIsCalling(false);
  };

  return (
    <div>
      <h2>Video Call</h2>
      <div>
        <video ref={userVideo} autoPlay playsInline muted />
        <video ref={partnerVideo} autoPlay playsInline />
      </div>
      {isCalling ? (
        <div>
          <button onClick={handleAnswer}>Answer Call</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleCallUser("partner-id")}>Call User</button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
