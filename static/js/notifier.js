const notificationBar = document.getElementById('notification-bar');

export function showNotification(msg, color){
    notificationBar.innerText = msg;
    notificationBar.style.backgroundColor = color;
    notificationBar.style.display = 'block';
    setTimeout(()=>{
        notificationBar.style.display = 'none';
    },1000)
}