function archiveMessage(button) {
    const card = button.closest('.message-card');
    card.style.opacity = '0';
    card.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        card.remove();
        if (document.querySelectorAll('.message-card').length === 0) {
            document.querySelector('.inbox-container').innerHTML = 
                '<p class="text-center text-dim mt-5">Your inbox is clear! Good job.</p>';
        }
    }, 300);
}

document.querySelectorAll('.btn-archive').forEach(btn => {
    btn.onclick = () => archiveMessage(btn);
});

let currentMessageCard = null;

function openReplyModal(button) {
    currentMessageCard = button.closest('.message-card');
    
    const studentName = currentMessageCard.querySelector('.student-name').innerText;
    
    document.getElementById('replyStudentName').innerText = studentName;
    document.getElementById('replyModal').style.display = "block";
}

function closeReplyModal() {
    document.getElementById('replyModal').style.display = "none";
    document.getElementById('replyForm').reset();
}

document.getElementById('replyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const replyText = document.getElementById('replyMessage').value;
    
    alert("Reply sent successfully to " + document.getElementById('replyStudentName').innerText);
    
    if (currentMessageCard) {
        currentMessageCard.classList.remove('unread');
    }
    
    closeReplyModal();
});

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    modal.style.display = "none";
    
    document.getElementById('replyForm').reset();
}

window.onclick = (event) => {
    if (event.target == document.getElementById('replyModal')) closeReplyModal();
};
