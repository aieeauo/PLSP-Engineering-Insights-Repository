let currentMessageCard = null;

function archiveMessage(button) {
    const card = button.closest('.message-card');
    
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        card.remove();
        const remainingCards = document.querySelectorAll('.message-card');
        if (remainingCards.length === 0) {
            document.querySelector('.inbox-container').innerHTML = 
                '<div class="text-center mt-5"><i class="fa-solid fa-circle-check mb-3" style="font-size: 3rem; color: #ffcc00;"></i>' +
                '<p class="text-dim">Your inbox is clear! Good job, Engr.</p></div>';
        }
    }, 300);
}

document.querySelectorAll('.btn-archive').forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        archiveMessage(btn);
    };
});

function openReplyModal(studentNameOrButton) {
    const modal = document.getElementById('replyModal');
    const nameDisplay = document.getElementById('replyStudentName');

    if (typeof studentNameOrButton === 'string') {
        nameDisplay.innerText = studentNameOrButton;
        const cards = document.querySelectorAll('.message-card');
        currentMessageCard = Array.from(cards).find(c => 
            c.querySelector('.student-name').innerText === studentNameOrButton
        );
    } else {
        currentMessageCard = studentNameOrButton.closest('.message-card');
        nameDisplay.innerText = currentMessageCard.querySelector('.student-name').innerText;
    }
    
    modal.style.display = "flex"; 
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    modal.style.display = "none";
    document.getElementById('replyForm').reset();
}

document.getElementById('replyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentName = document.getElementById('replyStudentName').innerText;
    const replyContent = document.getElementById('replyMessage').value;
    
    alert("Reply sent successfully to " + studentName);
    
    if (currentMessageCard) {
        currentMessageCard.classList.remove('unread');
    }
    
    closeReplyModal();
});

window.onclick = (event) => {
    const modal = document.getElementById('replyModal');
    if (event.target == modal) {
        closeReplyModal();
    }
};