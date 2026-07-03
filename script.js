        // Tab switching logic
        const navItems = document.querySelectorAll('.nav-list .nav-item');
        const contentCards = document.querySelectorAll('main .content-card');

        function switchTab(tabId) {
            navItems.forEach(item => {
                if (item.getAttribute('data-tab') === tabId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            contentCards.forEach(card => {
                if (card.id === `tab-${tabId}`) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            // Special handling for delivery tab to load report preview
            if (tabId === 'delivery') {
                document.getElementById('report-preview').classList.add('active');
            } else {
                document.getElementById('report-preview').classList.remove('active');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                switchTab(item.getAttribute('data-tab'));
            });
        });

        // Next/Prev Buttons
        document.querySelectorAll('.next-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-next'));
            });
        });

        document.querySelectorAll('.prev-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-prev'));
            });
        });

        // Copy functionality
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const codeElement = document.getElementById(targetId);
                
                // Get clean text replacing HTML tags
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = codeElement.innerText;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);

                btn.innerText = 'Copiado!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.innerText = 'Copiar';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });

        // Screenshot upload and preview handling
        const imageInputs = [1, 2, 3, 4, 5];
        imageInputs.forEach(num => {
            const fileInput = document.getElementById(`img-input-${num}`);
            const statusText = document.getElementById(`upload-status-${num}`);
            const previewImg = document.getElementById(`preview-${num}`);
            const printImg = document.getElementById(`print-img-${num}`);

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Data = event.target.result;
                        previewImg.src = base64Data;
                        previewImg.classList.add('active');
                        
                        // Set image in printable report
                        printImg.src = base64Data;

                        statusText.innerText = "✓ Enviado com sucesso!";
                        statusText.className = "upload-status success";

                        // Save image base64 locally in session
                        sessionStorage.setItem(`screenshot-${num}`, base64Data);
                        
                        // Recalculate indicators
                        updateProgress();
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Restore from session if exists
            const savedImg = sessionStorage.getItem(`screenshot-${num}`);
            if (savedImg) {
                previewImg.src = savedImg;
                previewImg.classList.add('active');
                printImg.src = savedImg;
                statusText.innerText = "✓ Enviado com sucesso!";
                statusText.className = "upload-status success";
            }
        });

        // Set Print Date
        const dateObj = new Date();
        const formattedDate = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0') + '/' + dateObj.getFullYear();
        // IDs are now in #report-print-root (outside all tabs)
        const printDateEl = document.getElementById('print-date');
        if (printDateEl) printDateEl.innerText = formattedDate;

        // Print Report Action button
        document.getElementById('btn-print-report').addEventListener('click', () => {
            // Check if all screenshots were uploaded first
            let allUploaded = true;
            for (let i = 1; i <= 5; i++) {
                if (!sessionStorage.getItem(`screenshot-${i}`)) {
                    allUploaded = false;
                }
            }

            if (!allUploaded) {
                if (!confirm("Atenção Raquele: você ainda não carregou todos os 5 prints de evidência. Deseja imprimir o relatório mesmo assim?")) {
                    return;
                }
            }

            // Sync statuses and images into the outer print container
            for (let i = 1; i <= 5; i++) {
                const saved = sessionStorage.getItem(`screenshot-${i}`);
                const statusLabel = document.getElementById(`print-status-${i}`);
                const printImg    = document.getElementById(`print-img-${i}`);
                if (statusLabel) {
                    statusLabel.innerText    = saved ? 'CONCLUÍDO' : 'PENDENTE';
                    statusLabel.style.color  = saved ? '#10b981'   : '#ef4444';
                }
                if (printImg && saved) printImg.src = saved;
            }

            // #report-print-root is shown exclusively by @media print — just call print()
            window.print();
        });

        // Checklist, Progress Bar & Indicator logic
        const tasks = [
            { id: 'task-model-1', step: 1 },
            { id: 'task-model-2', step: 1 },
            { id: 'task-env-1', step: 2 },
            { id: 'task-env-2', step: 2 },
            { id: 'task-env-3', step: 2 },
            { id: 'task-sql-1', step: 3 },
            { id: 'task-sql-2', step: 3 },
            { id: 'task-sql-3', step: 3 },
            { id: 'task-conn-1', step: 4 },
            { id: 'task-conn-2', step: 4 },
            { id: 'task-crud-1', step: 5 },
            { id: 'task-crud-2', step: 5 },
            { id: 'task-crud-3', step: 5 }
        ];

        // Load saved state from localStorage
        function loadState() {
            tasks.forEach(task => {
                const checked = localStorage.getItem(task.id) === 'true';
                const el = document.getElementById(task.id);
                if (el) {
                    el.checked = checked;
                    if (checked) {
                        el.closest('.task-item').classList.add('checked');
                    }
                }
            });
            updateProgress();
        }

        // Save checked state
        tasks.forEach(task => {
            const el = document.getElementById(task.id);
            if (el) {
                el.closest('.task-item').addEventListener('click', (e) => {
                    if (e.target !== el) {
                        el.checked = !el.checked;
                    }
                    
                    const checked = el.checked;
                    localStorage.setItem(task.id, checked ? 'true' : 'false');
                    
                    if (checked) {
                        el.closest('.task-item').classList.add('checked');
                    } else {
                        el.closest('.task-item').classList.remove('checked');
                    }
                    updateProgress();
                });
            }
        });

        // Calculate progress percentage and update visual status
        function updateProgress() {
            let completedCount = 0;
            const stepCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const stepTotals = { 1: 2, 2: 3, 3: 3, 4: 2, 5: 3 };

            tasks.forEach(task => {
                const el = document.getElementById(task.id);
                if (el && el.checked) {
                    completedCount++;
                    stepCounts[task.step]++;
                }
            });

            const totalTasks = tasks.length;
            const pct = Math.round((completedCount / totalTasks) * 100);

            // Update Progress Circle SVG stroke-dashoffset
            const fillElement = document.getElementById('progressFill');
            const offset = 408.4 - (408.4 * pct / 100);
            fillElement.style.strokeDashoffset = offset;

            // Update Text Percentages
            document.getElementById('progressPct').innerText = `${pct}%`;

            // Progress motivational text
            const descEl = document.getElementById('progressText');
            if (pct === 0) descEl.innerText = "Vamos começar, Raquele! Respeite seu tempo.";
            else if (pct < 30) descEl.innerText = "Ótimo início! Um passo de cada vez.";
            else if (pct < 70) descEl.innerText = "Muito bem, você já fez mais da metade!";
            else if (pct < 100) descEl.innerText = "Falta muito pouco! Quase lá.";
            else descEl.innerText = "Parabéns, Raquele! Tudo concluído com sucesso! 🎉";

            // Update indicator badges & aside lists
            for (let step = 1; step <= 5; step++) {
                // An indicator is fully complete only if the step checklist is complete AND the screenshot is uploaded!
                const checklistDone = stepCounts[step] === stepTotals[step];
                const screenshotDone = sessionStorage.getItem(`screenshot-${step}`) !== null;
                
                const stepCompleted = checklistDone && screenshotDone;

                const badgeEl = document.getElementById(`ind-status-${step}`);
                const cardEl = document.getElementById(`ind-card-${step}`);
                const navItemEl = document.getElementById(`nav-step${step}`);

                if (stepCompleted) {
                    badgeEl.innerText = "Concluído";
                    badgeEl.className = "indicator-status-badge status-completed";
                    cardEl.classList.add('completed');
                    navItemEl.classList.add('completed');
                } else {
                    let pendingText = "Pendente";
                    if (checklistDone && !screenshotDone) {
                        pendingText = "Sem Print";
                    }
                    badgeEl.innerText = pendingText;
                    badgeEl.className = "indicator-status-badge status-pending";
                    cardEl.classList.remove('completed');
                    navItemEl.classList.remove('completed');
                }
            }
        }

        // Initialize state on page load
        window.addEventListener('load', loadState);
