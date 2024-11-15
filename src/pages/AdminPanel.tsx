import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { UserPlus, Link as LinkIcon, Trash, Plus } from 'lucide-react';
import type { UserData, BlogPost } from '../types';
import AdminUserCard from '../components/AdminUserCard';
import BlogPostModal from '../components/BlogPostModal';

export default function AdminPanel() {
  const [users, setUsers] = useState<(UserData & { id: string })[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as UserData
      }));
      setUsers(usersData);

      // Fetch blog posts
      const postsSnapshot = await getDocs(collection(db, 'posts'));
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserBalance = async (userId: string, apiKeyIndex: number, newBalance: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const updatedApiKeys = [...user.apiKeys];
      updatedApiKeys[apiKeyIndex] = {
        ...updatedApiKeys[apiKeyIndex],
        balance: newBalance
      };

      await updateDoc(doc(db, 'users', userId), {
        apiKeys: updatedApiKeys
      });

      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, apiKeys: updatedApiKeys }
          : u
      ));

      toast.success('Balance updated successfully');
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleCreatePost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newPost = {
        ...post,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      setPosts([...posts, { ...newPost, id: docRef.id }]);
      setIsPostModalOpen(false);
      toast.success('Post created successfully');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(p => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Users Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="space-y-4">
          {users.map(user => (
            <AdminUserCard
              key={user.id}
              user={user}
              onUpdateBalance={handleUpdateUserBalance}
              onDeleteUser={handleDeleteUser}
            />
          ))}
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Blog Posts</h2>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{post.title}</h3>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">{post.description}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Visit Link
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Posted on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <BlogPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}