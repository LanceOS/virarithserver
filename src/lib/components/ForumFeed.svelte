<script>
	// Sample data structure - you can replace this with your actual posts
	let posts = [
	  {
		id: 1,
		title: "Version 2.1.0 Released - New Dashboard Features",
		content: "We've added a completely redesigned dashboard with real-time analytics, improved user management, and enhanced security features. This update also includes bug fixes for the notification system.",
		author: "John Smith",
		date: "2024-05-20",
		category: "Release",
		likes: 24,
		comments: 8,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
	  },
	  {
		id: 2,
		title: "Hotfix 2.0.3 - Critical Security Patch",
		content: "Emergency security update addressing vulnerabilities in the authentication system. All users are strongly advised to update immediately.",
		author: "Sarah Johnson",
		date: "2024-05-18",
		category: "Hotfix",
		likes: 12,
		comments: 3,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
	  }
	];
  
	// Formatted date
	function formatDate(dateString) {
	  const date = new Date(dateString);
	  return date.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric' 
	  });
	}
  
	// Get category color class
	function getCategoryClass(category) {
	  const categoryClasses = {
		'Release': 'category-release',
		'Hotfix': 'category-hotfix',
		'Update': 'category-update',
		'Announcement': 'category-announcement'
	  };
	  return categoryClasses[category] || 'category-default';
	}
  </script>
  
  <section>

	<header class="mb-6 flex flex-col gap-2">
	  <h2 class="text-4xl text-white">Change Logs</h2>
	  <p class="text-lg muted">Stay updated with the latest changes and improvements</p>
	</header>
  
	<div class="posts-container">
	  {#each posts as post (post.id)}
		<article class="forum-card">


			<header class="forum-card-header">
			<div class="author-info">
			  <img 
				src={post.avatar} 
				alt="{post.author}'s avatar"
				class="avatar"
				loading="lazy"
			  />
			  <div class="author-details">
				<span class="author-name">{post.author}</span>
				<time class="timestamp" datetime={post.date}>
				  {formatDate(post.date)}
				</time>
			  </div>
			</div>
			<span class="category {getCategoryClass(post.category)}">{post.category}</span>
		  </header>
  


		  <div class="forum-card-content">
			<h3 class="forum-card-title">
			  <a href="/changelog/{post.id}" class="title-link">
				{post.title}
			  </a>
			</h3>
			<p class="forum-card-body">{post.content}</p>
		  </div>
  



		  <footer class="forum-card-footer">
			<div class="stats">
			  <span class="stat-item">
				<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
				</svg>
				{post.likes}
			  </span>
			  <span class="stat-item">
				<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
				</svg>
				{post.comments}
			  </span>
			</div>
			<button class="read-more-btn" aria-label="Read more about {post.title}">
			  Read More
			  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			  </svg>
			</button>
		  </footer>
		</article>
	  {/each}
	</div>
  </section>
  
  <style>
  
	.posts-container {
	  display: flex;
	  flex-direction: column;
	  gap: 1.5rem;
	}
  
	.forum-card {
	  background: var(--color-input, #1f2937);
	  color: var(--color-input-content, #f9fafb);
	  padding: 1.5rem;
	  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	  border: 1px solid rgba(255, 255, 255, 0.1);
	  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	  position: relative;
	  overflow: hidden;
	}
  
	.forum-card::before {
	  content: '';
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  height: 3px;
	  background: linear-gradient(90deg, var(--color-primary, #3b82f6), #8b5cf6);
	  opacity: 0;
	  transition: opacity 0.3s ease;
	}
  
	.forum-card:hover {
	  transform: translateY(-4px);
	  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
	  border-color: rgba(255, 255, 255, 0.2);
	}
  
	.forum-card:hover::before {
	  opacity: 1;
	}
  
	.forum-card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: flex-start;
	  margin-bottom: 1rem;
	  gap: 1rem;
	}
  
	.author-info {
	  display: flex;
	  align-items: center;
	  gap: 0.75rem;
	  min-width: 0;
	}
  
	.avatar {
	  width: 40px;
	  height: 40px;
	  border-radius: 50%;
	  object-fit: cover;
	  border: 2px solid rgba(255, 255, 255, 0.1);
	  flex-shrink: 0;
	}
  
	.author-details {
	  display: flex;
	  flex-direction: column;
	  min-width: 0;
	}
  
	.author-name {
	  font-weight: 600;
	  font-size: 0.9rem;
	  color: var(--color-base-content, #f9fafb);
	  margin: 0;
	}
  
	.timestamp {
	  font-size: 0.75rem;
	  color: var(--color-muted, #9ca3af);
	  margin: 0;
	}
  
	.category {
	  padding: 0.25rem 0.75rem;
	  border-radius: 20px;
	  font-size: 0.75rem;
	  font-weight: 600;
	  text-transform: uppercase;
	  letter-spacing: 0.05em;
	  flex-shrink: 0;
	}
  
	.category-release {
	  background: rgba(34, 197, 94, 0.2);
	  color: #22c55e;
	}
  
	.category-hotfix {
	  background: rgba(239, 68, 68, 0.2);
	  color: #ef4444;
	}
  
	.category-update {
	  background: rgba(59, 130, 246, 0.2);
	  color: #3b82f6;
	}
  
	.category-announcement {
	  background: rgba(168, 85, 247, 0.2);
	  color: #a855f7;
	}
  
	.category-default {
	  background: rgba(156, 163, 175, 0.2);
	  color: #9ca3af;
	}
  
	.forum-card-content {
	  margin-bottom: 1.5rem;
	}
  
	.forum-card-title {
	  margin: 0 0 0.75rem 0;
	  font-size: 1.25rem;
	  font-weight: 700;
	  line-height: 1.3;
	}
  
	.title-link {
	  color: var(--color-base-content, #f9fafb);
	  text-decoration: none;
	  transition: color 0.2s ease;
	}
  
	.title-link:hover {
	  color: var(--color-primary, #3b82f6);
	}
  
	.forum-card-body {
	  font-size: 0.95rem;
	  line-height: 1.6;
	  color: var(--color-input-content, #d1d5db);
	  margin: 0;
	}
  
	.forum-card-footer {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  gap: 1rem;
	  padding-top: 1rem;
	  border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
  
	.stats {
	  display: flex;
	  gap: 1rem;
	}
  
	.stat-item {
	  display: flex;
	  align-items: center;
	  gap: 0.25rem;
	  font-size: 0.8rem;
	  color: var(--color-muted, #9ca3af);
	}
  
	.stat-icon {
	  width: 14px;
	  height: 14px;
	  stroke-width: 2;
	}
  
	.read-more-btn {
	  display: flex;
	  align-items: center;
	  gap: 0.5rem;
	  background: transparent;
	  border: 1px solid #946b2d;
	  color: #946b2d;
	  padding: 0.5rem 1rem;
	  border-radius: 6px;
	  font-size: 0.8rem;
	  font-weight: 500;
	  cursor: pointer;
	  transition: all 0.2s ease;
	}
  
	.read-more-btn:hover {
	  background: #946b2d;
	  color: white;
	  transform: translateX(2px);
	}
  
	.arrow-icon {
	  width: 14px;
	  height: 14px;
	  stroke-width: 2;
	  transition: transform 0.2s ease;
	}
  
	.read-more-btn:hover .arrow-icon {
	  transform: translateX(2px);
	}
  
	/* Responsive Design */
	@media (max-width: 640px) {
	  .forum-card {
		padding: 1rem;
	  }
	  
	  .feed-title {
		font-size: 2rem;
	  }
	  
	  .forum-card-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	  }
	  
	  .forum-card-footer {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	  }
	  
	  .read-more-btn {
		align-self: flex-end;
	  }
	}
  </style>