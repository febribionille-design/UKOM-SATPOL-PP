
        // ==========================================
        // DATA SOAL (MOCK DATA SATPOL PP)
        // ==========================================
        const examQuestions = [
            {
                kategori: "Regulasi",
                pertanyaan: "Berdasarkan Peraturan Pemerintah (PP) No. 16 Tahun 2018, Satuan Polisi Pamong Praja dibentuk untuk menegakkan...",
                opsi: [
                    "Hukum Pidana Umum",
                    "Peraturan Daerah (Perda) dan Peraturan Kepala Daerah (Perkada)",
                    "Undang-Undang Lalu Lintas",
                    "Peraturan Kepolisian Negara Republik Indonesia"
                ],
                jawabanBenar: 1
            },
            {
                kategori: "Tibum Tranmas",
                pertanyaan: "Tindakan pertama yang paling tepat dilakukan oleh anggota Satpol PP saat menemui Pedagang Kaki Lima (PKL) yang melanggar zona larangan berjualan adalah...",
                opsi: [
                    "Melakukan penyitaan barang dagangan secara langsung",
                    "Memberikan teguran lisan secara persuasif dan humanis",
                    "Melakukan pembongkaran paksa lapak dagangan",
                    "Melaporkan kepada pihak Kepolisian"
                ],
                jawabanBenar: 1
            },
            {
                kategori: "SOP & Teknis",
                pertanyaan: "Dalam melaksanakan tugas patroli wilayah, pendekatan yang harus dikedepankan oleh Satpol PP adalah...",
                opsi: [
                    "Preventif dan Persuasif",
                    "Represif dan Koersif",
                    "Investigatif dan Interogatif",
                    "Defensif dan Pasif"
                ],
                jawabanBenar: 0
            },
            {
                kategori: "Etika Profesi",
                pertanyaan: "Sikap yang mencerminkan profesionalisme Satpol PP saat berhadapan dengan masyarakat yang emosi/marah akibat penertiban adalah...",
                opsi: [
                    "Membalas dengan nada suara yang tinggi agar dihormati",
                    "Meninggalkan lokasi penertiban untuk menghindari konflik",
                    "Tetap tenang, tidak terpancing emosi, dan memberikan penjelasan secara rasional",
                    "Meminta bantuan warga sekitar untuk menenangkan pelanggar"
                ],
                jawabanBenar: 2
            },
            {
                kategori: "Regulasi",
                pertanyaan: "Satpol PP dalam pelaksanaan tugasnya berkedudukan di bawah dan bertanggung jawab kepada...",
                opsi: [
                    "Kapolres setempat",
                    "Menteri Dalam Negeri secara langsung",
                    "Kepala Daerah (Gubernur/Bupati/Wali Kota) melalui Sekretaris Daerah",
                    "Komandan Kodim setempat"
                ],
                jawabanBenar: 2
            }
        ];

        // ==========================================
        // STATE MANAGEMENT
        // ==========================================
        let currentUser = {};
        let currentQuestionIndex = 0;
        let userAnswers = new Array(examQuestions.length).fill(null);
        let timeRemaining = 30 * 60; // 30 Menit dalam detik
        let timerInterval;

        // ==========================================
        // FUNGSI LAYAR PENUH (FULLSCREEN API)
        // ==========================================
        function requestFullScreenMode() {
            const docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) { /* Firefox */
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                docElm.webkitRequestFullscreen();
            } else if (docElm.msRequestFullscreen) { /* IE/Edge */
                docElm.msRequestFullscreen();
            }
            updateFullscreenIcon(true);
        }

        function exitFullScreenMode() {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            updateFullscreenIcon(false);
        }

        // Fungsi toggle untuk tombol darurat di dalam ujian
        function toggleFullScreen() {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                requestFullScreenMode();
            } else {
                exitFullScreenMode();
            }
        }

        function updateFullscreenIcon(isFullscreen) {
            const icon = document.getElementById('fullscreen-icon');
            if(isFullscreen) {
                // Ikon Exit Fullscreen
                icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"></path>`;
            } else {
                // Ikon Enter Fullscreen
                icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>`;
            }
        }

        // Listener jika user keluar fullscreen manual (tekan ESC)
        document.addEventListener('fullscreenchange', (event) => {
            if (!document.fullscreenElement) {
                updateFullscreenIcon(false);
            } else {
                updateFullscreenIcon(true);
            }
        });

        // ==========================================
        // FUNGSI UTAMA UJIAN
        // ==========================================
        function startExam() {
            // 1. Ambil data
            const nama = document.getElementById('input-nama').value;
            const nip = document.getElementById('input-nip').value;
            if(!nama || !nip) return;

            currentUser = { nama, nip };

            // 2. Set UI Data
            document.getElementById('display-nama').textContent = nama;
            document.getElementById('display-nip').textContent = "NIP: " + nip;
            document.getElementById('display-initial').textContent = nama.charAt(0).toUpperCase();

            // 3. Pindah Layar (Sembunyikan Login, Tampilkan Ujian)
            document.getElementById('login-screen').classList.add('screen-hidden');
            document.getElementById('exam-screen').classList.remove('screen-hidden');

            // 4. Aktifkan Layar Penuh (Auto-Fullscreen Trigger)
            requestFullScreenMode();

            // 5. Inisiasi Ujian
            initGrid();
            renderQuestion();
            startTimer();
        }

        function renderQuestion() {
            const q = examQuestions[currentQuestionIndex];
            document.getElementById('current-q-num').textContent = currentQuestionIndex + 1;
            document.getElementById('kategori-soal').textContent = "Kategori: " + q.kategori;
            document.getElementById('question-text').textContent = q.pertanyaan;

            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            q.opsi.forEach((opt, index) => {
                const isChecked = userAnswers[currentQuestionIndex] === index ? 'checked' : '';
                const optionLetters = ['A', 'B', 'C', 'D'];
                
                const html = `
                    <label class="block cursor-pointer relative group">
                        <input type="radio" name="answer" class="sr-only radio-custom" value="${index}" onchange="selectAnswer(${index})" ${isChecked}>
                        <div class="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-start gap-4 bg-white group-hover:border-blue-300">
                            <div class="radio-circle w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0 mt-0.5 relative transition"></div>
                            <div class="flex-1">
                                <span class="font-bold text-slate-700 mr-2">${optionLetters[index]}.</span>
                                <span class="text-slate-600 leading-relaxed text-sm md:text-base">${opt}</span>
                            </div>
                        </div>
                    </label>
                `;
                optionsContainer.insertAdjacentHTML('beforeend', html);
            });

            // Update Navigation Buttons
            document.getElementById('btn-prev').disabled = currentQuestionIndex === 0;
            
            const btnNext = document.getElementById('btn-next');
            if (currentQuestionIndex === examQuestions.length - 1) {
                btnNext.innerHTML = 'Selesai <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                btnNext.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                btnNext.classList.add('bg-green-600', 'hover:bg-green-700', 'shadow-green-600/30');
                btnNext.onclick = confirmFinish;
            } else {
                btnNext.innerHTML = 'Selanjutnya <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
                btnNext.classList.add('bg-blue-600', 'hover:bg-blue-700');
                btnNext.classList.remove('bg-green-600', 'hover:bg-green-700', 'shadow-green-600/30');
                btnNext.onclick = nextQuestion;
            }

            updateGrid();
        }

        function selectAnswer(index) {
            userAnswers[currentQuestionIndex] = index;
            updateGrid();
        }

        function nextQuestion() {
            if (currentQuestionIndex < examQuestions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            }
        }

        function prevQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        }

        function jumpToQuestion(index) {
            currentQuestionIndex = index;
            renderQuestion();
        }

        // ==========================================
        // SIDEBAR GRID NUMBERING
        // ==========================================
        function initGrid() {
            const grid = document.getElementById('number-grid');
            grid.innerHTML = '';
            for (let i = 0; i < examQuestions.length; i++) {
                const btn = document.createElement('button');
                btn.className = 'w-10 h-10 rounded border font-bold text-sm transition flex items-center justify-center';
                btn.id = `grid-btn-${i}`;
                btn.onclick = () => jumpToQuestion(i);
                btn.textContent = i + 1;
                grid.appendChild(btn);
            }
        }

        function updateGrid() {
            for (let i = 0; i < examQuestions.length; i++) {
                const btn = document.getElementById(`grid-btn-${i}`);
                
                // Reset classes
                btn.className = 'w-10 h-10 rounded font-bold text-sm transition flex items-center justify-center ';
                
                if (i === currentQuestionIndex) {
                    btn.classList.add('border-2', 'border-slate-800', 'bg-white', 'text-slate-800'); // Active
                } else if (userAnswers[i] !== null) {
                    btn.classList.add('bg-blue-600', 'text-white', 'border-transparent'); // Answered
                } else {
                    btn.classList.add('border', 'border-slate-300', 'bg-white', 'text-slate-600', 'hover:bg-slate-100'); // Unanswered
                }
            }
        }

        // ==========================================
        // TIMER & PENYELESAIAN
        // ==========================================
        function startTimer() {
            const display = document.getElementById('timer-display');
            timerInterval = setInterval(() => {
                timeRemaining--;
                
                let minutes = Math.floor(timeRemaining / 60);
                let seconds = timeRemaining % 60;
                
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                
                display.textContent = minutes + ":" + seconds;

                // Peringatan waktu mau habis (< 5 menit)
                if(timeRemaining < 300) {
                    display.classList.add('text-red-600');
                    display.parentElement.classList.add('bg-red-50', 'border-red-200');
                }

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    finishExam(true); // Auto submit krn waktu habis
                }
            }, 1000);
        }

        function confirmFinish() {
            const unanswered = userAnswers.filter(a => a === null).length;
            const msgEl = document.getElementById('confirm-text');
            
            if (unanswered > 0) {
                msgEl.innerHTML = `<span class="text-red-500 font-bold">Peringatan:</span> Anda masih memiliki <b>${unanswered}</b> soal yang belum dijawab. Yakin ingin mengakhiri ujian?`;
            } else {
                msgEl.textContent = "Semua soal telah dijawab. Yakin ingin menyimpan jawaban dan melihat hasil?";
            }
            
            document.getElementById('confirm-modal').classList.remove('hidden');
        }

        function closeConfirmModal() {
            document.getElementById('confirm-modal').classList.add('hidden');
        }

        function finishExam(isTimeOut = false) {
            clearInterval(timerInterval);
            document.getElementById('confirm-modal').classList.add('hidden');
            
            // Evaluasi Nilai
            let correct = 0;
            userAnswers.forEach((ans, index) => {
                if (ans === examQuestions[index].jawabanBenar) correct++;
            });
            
            const totalScore = Math.round((correct / examQuestions.length) * 100);
            const wrong = examQuestions.length - correct;

            // Set UI Hasil
            document.getElementById('final-score').textContent = totalScore;
            document.getElementById('correct-count').textContent = correct;
            document.getElementById('wrong-count').textContent = wrong;
            
            if(isTimeOut) {
                document.getElementById('result-message').textContent = "Waktu Habis! Jawaban Anda telah otomatis tersimpan.";
            }

            // Ganti Layar
            document.getElementById('exam-screen').classList.add('screen-hidden');
            document.getElementById('result-screen').classList.remove('screen-hidden');

            // KELUAR DARI LAYAR PENUH SECARA OTOMATIS (Auto-Exit Fullscreen)
            exitFullScreenMode();
        }
