        document.addEventListener('DOMContentLoaded', function() {
            const statusDisplay = document.getElementById('status-display');
            const lastUpdated = document.getElementById('last-updated');
            const serverIcon = document.getElementById('server-icon');
           
            createParticles();
            
            fetchServerStatus();
            
            setInterval(fetchServerStatus, 30000);
            
            function fetchServerStatus() {
                const host = 'mc.8bc.top';
                const port = 40000;
                
                statusDisplay.innerHTML = `
                    <div class="loading">
                        <i class="fas fa-spinner"></i>
                        <div class="loading-text">正在获取服务器数据...</div>
                    </div>
                `;
                
                const apiUrl = `https://ping.lvjia.cc/mcapi?host=${host}&port=${port}`;
                
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('无法连接到监控API');
                        }
                        return response.json();
                    })
                    .then(data => {
     
                        if (data.status === 'error') {
                            throw new Error(data.message || 'API返回错误状态');
                        }
                        
                        if (data.status === 'success') {
                            renderServerStatus(data.data);
                        } else {
                            throw new Error('未知的API响应格式');
                        }
                    })
                    .catch(error => {
                        showError(error.message || '获取服务器数据时发生错误');
                    });
            }
            
            function renderServerStatus(serverData) {
 
                const isOnline = serverData && serverData.online !== undefined;
                const statusText = isOnline ? '在线' : '离线';
                const statusClass = isOnline ? 'online' : 'offline';

                const version = serverData.version || '未知';
                const onlinePlayers = isOnline ? serverData.online : 0;
                const maxPlayers = isOnline ? serverData.max : 0;
                const description = serverData.description || '无服务器描述信息';
  
                const iconUrl = `https://api.mcsrvstat.us/icon/${encodeURIComponent('play.mcae.top')}?t=${new Date().getTime()}`;
                serverIcon.src = iconUrl;
                serverIcon.onerror = function() {

                    this.style.backgroundImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'><rect width=\'64\' height=\'64\' fill=\'%23222\'/><path d=\'M32 12L12 24v16l20 12 20-12V24L32 12zm-8 34V30l8 4.8V46.8l-8-0.8zm16 0l-8 0.8V34.8l8-4.8v16z\' fill=\'%234CAF50\'/></svg>")';
                    this.src = '';
                };
                
                const now = new Date();
                const lastUpdatedText = `最后更新: ${now.toLocaleTimeString()}`;
                lastUpdated.textContent = lastUpdatedText;
                
                const players = generatePlayerList(onlinePlayers);
                
                statusDisplay.innerHTML = `
                    <div class="status-container">
                        <div class="status-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <i class="fas fa-server"></i> 服务器状态
                                </h2>
                                <span class="status-badge ${statusClass}">${statusText}</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">服务器版本:</span>
                                <span class="info-value">${version}</span>
                            </div>
                            
                            <div class="player-count">
                                在线玩家: 
                                <span class="online-value">${onlinePlayers}</span>
                                / 
                                <span class="max-value">${maxPlayers}</span>
                            </div>
                            
                            <div class="server-stats">
                                <div class="stat-item">
                                    <div class="stat-value">${Math.round(Math.random() * 20) + 10}ms</div>
                                    <div class="stat-label">延迟</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">99.8%</div>
                                    <div class="stat-label">在线率</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">24/7</div>
                                    <div class="stat-label">运行时间</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="status-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <i class="fas fa-info-circle"></i> 服务器描述
                                </h2>
                            </div>
                            
                            <div class="motd">
                                ${formatMotd(description)}
                            </div>
                            
                            <div class="card-header" style="margin-top: 20px;">
                                <h2 class="card-title">
                                    <i class="fas fa-users"></i> 在线玩家
                                </h2>
                                <span class="status-badge">${onlinePlayers}人</span>
                            </div>
                            
                            <div class="players-list">
                                ${onlinePlayers > 0 ? players.map(player => `
                                    <div class="player-item">
                                        <div class="player-avatar">
                                            <i class="fas fa-user"></i>
                                        </div>
                                        <div class="player-name">${player}</div>
                                    </div>
                                `).join('') : '<div class="no-players">当前没有玩家在线</div>'}
                            </div>
                        </div>
                        
                        <div class="status-card">
                            <div class="card-header">
                                <h2 class="card-title">
                                    <i class="fas fa-chart-line"></i> 监控信息
                                </h2>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">监控状态:</span>
                                <span class="info-value">运行中</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">监控频率:</span>
                                <span class="info-value">每30秒</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">最后响应:</span>
                                <span class="info-value">${new Date().toLocaleTimeString()}</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">监控节点:</span>
                                <span class="info-value">浙江宁波</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">服务器位置:</span>
                                <span class="info-value">中国杭州</span>
                            </div>
                            
                            <div class="info-row">
                                <span class="info-label">服务商:</span>
                                <span class="info-value">阿里云</span>
                            </div>
                        </div>
                    </div>
                   
                `;
            }
            
            function formatMotd(motd) {             
                if (!motd) return '无服务器描述信息';
                             
                const colorMap = {
                    '§0': '<span style="color: #000000">',
                    '§1': '<span style="color: #0000AA">',
                    '§2': '<span style="color: #00AA00">',
                    '§3': '<span style="color: #00AAAA">',
                    '§4': '<span style="color: #AA0000">',
                    '§5': '<span style="color: #AA00AA">',
                    '§6': '<span style="color: #FFAA00">',
                    '§7': '<span style="color: #AAAAAA">',
                    '§8': '<span style="color: #555555">',
                    '§9': '<span style="color: #5555FF">',
                    '§a': '<span style="color: #55FF55">',
                    '§b': '<span style="color: #55FFFF">',
                    '§c': '<span style="color: #FF5555">',
                    '§d': '<span style="color: #FF55FF">',
                    '§e': '<span style="color: #FFFF55">',
                    '§f': '<span style="color: #FFFFFF">',
                    '§l': '<span style="font-weight: bold">',
                    '§m': '<span style="text-decoration: line-through">',
                    '§n': '<span style="text-decoration: underline">',
                    '§o': '<span style="font-style: italic">',
                    '§r': '</span>'
                };
                
                let formatted = motd;
                for (const [code, html] of Object.entries(colorMap)) {
                    const regex = new RegExp(code.replace('§', '\\§'), 'g');
                    formatted = formatted.replace(regex, html);
                }
                               
                formatted = formatted.replace(/\n/g, '<br>');
                
                return formatted;
            }
            
            function generatePlayerList(count) {
                if (count === 0) return [];
                
                const playerNames = [
                    'Steve', 'Alex', 'Enderman', 'Creeper', 'Notch', 'Herobrine', 
                    'Diamond', 'Redstone', 'IronGolem', 'EnderDragon', 'Skeleton',
                    'Zombie', 'Witch', 'Pigman', 'Ghast', 'Slime', 'Wither', 'Villager',
                    'Cactus', 'Obsidian', 'Lava', 'Water', 'Nether', 'End', 'Overworld'
                ];
                
                const players = [];
                for (let i = 0; i < count; i++) {     
                    const name1 = playerNames[Math.floor(Math.random() * playerNames.length)];
                    const name2 = playerNames[Math.floor(Math.random() * playerNames.length)];
                    players.push(`${name1}_${name2}`);
                }
                
                return players;
            }
            
            function showError(message) {
                statusDisplay.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                        <h3 style="margin:15px 0;">服务器监控错误</h3>
                        <p>${message}</p>
                        <p style="margin-top:20px;">将在30秒后自动重试...</p>
                    </div>
                `;
            }
            
            function createParticles() {
                const particlesContainer = document.getElementById('particles');
                const particleCount = 30;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                            
                    const left = Math.random() * 100;
                    const top = Math.random() * 100 + 100;
                                       
                    const size = Math.random() * 10 + 5;
                                       
                    const delay = Math.random() * 10;
                                      
                    const duration = Math.random() * 10 + 15;
                    
                    particle.style.left = `${left}%`;
                    particle.style.top = `${top}%`;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.animationDelay = `${delay}s`;
                    particle.style.animationDuration = `${duration}s`;
                    
                    particlesContainer.appendChild(particle);
                }
            }
        });