import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const JsonPlaceholderApiTest = () => {
  const [log, setLog] = useState<string[]>([]);
  const hasRunOnce = useRef(false);

  const addLog = (message: string) => {
    setLog(prevLogs => [...prevLogs, message]);
  };

  useEffect(() => {
    // Prevent running the test twice on re-renders
    if (hasRunOnce.current) return;
    hasRunOnce.current = true;

    const runApiTests = async () => {
      try {
        // Fetch all posts
        const responseAllPosts = await axios.get('https://jsonplaceholder.typicode.com/posts');
        addLog(`Retrieved ${responseAllPosts.data.length} posts`);

        // Fetch a specific post by ID
        const postIdToFetch = 1;
        const responseSinglePost = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postIdToFetch}`);
        addLog(`Retrieved post #${postIdToFetch}: ${JSON.stringify(responseSinglePost.data)}`);

        // Create a new post
        const responseNewPost = await axios.post('https://jsonplaceholder.typicode.com/posts', {
          title: "Mazen's Post",
          body: 'This is just a test post.',
          userId: 1,
        });
        const newPostId = responseNewPost.data.id;
        addLog(`Successfully created new post with ID: ${newPostId}`);

        // Update an existing post (using id from the ones stored, since the created one is not stored)
        const postIdToUpdate = 1;
        const responseUpdatedPost = await axios.put(`https://jsonplaceholder.typicode.com/posts/${postIdToUpdate}`, {
          id: postIdToUpdate,
          title: 'Updated Title',
          body: 'This content was updated.',
          userId: 1,
        });
        addLog(`Updated post #${postIdToUpdate}: ${responseUpdatedPost.data.title}`);

        // Delete an existing post (also using a known stored id)
        await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postIdToUpdate}`);
        addLog(` Deleted post #${postIdToUpdate}`);

      } catch (error: any) {
        addLog(`Something went wrong: ${error.message}`);
      }
    };

    runApiTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">JSONPlaceholder API Test Log</h2>
      <ul className="bg-gray-100 p-3 rounded shadow-sm">
        {log.map((entry, index) => (
          <li key={index} className="text-sm mb-1">{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default JsonPlaceholderApiTest;
