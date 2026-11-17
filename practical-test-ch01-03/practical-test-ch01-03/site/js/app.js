/* Câu 2: viết JavaScript tại đây*/ 

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ VN
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

// a) Hàm formatSeats (event)
const formatSeats = (event) => {
  if (event.registeredCount >= event.capacity) {
    return "Hết chỗ";
  }
  return `Còn ${event.capacity - event.registeredCount}/${event.capacity} chỗ`;
};
// b) Hàm renderEvents (events)
const renderEvents = (events) => {
  const eventListContainer = document.getElementById('event-list');
  const cardNodes = events.map(event => {
    const article = document.createElement('article');
    article.className = 'event-card';

    const img = document.createElement('img');
    img.setAttribute('src', 'img/event.svg');
    img.setAttribute('alt', event.name);

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.setAttribute('href', `event-detail.html?id=${event.id}`);
    a.textContent = event.name;
    h3.appendChild(a);

    const pTime = document.createElement('p');
    const timeEl = document.createElement('time');
    timeEl.setAttribute('datetime', event.startTime);
    timeEl.textContent = formatDateTime(event.startTime);
    pTime.appendChild(timeEl);

    const pLocation = document.createElement('p');
    pLocation.textContent = event.location;

    const pSeats = document.createElement('p');
    const seatsText = formatSeats(event);
    pSeats.textContent = seatsText;
    if (seatsText === "Hết chỗ") {
      pSeats.className = 'seats full';
    } else {
      pSeats.className = 'seats';
    }

    article.replaceChildren(img, h3, pTime, pLocation, pSeats);
    return article;
  });

  eventListContainer.replaceChildren(...cardNodes);
};
/* c) Hàm async loadEvents (keyword)*/
const loadEvents = async (keyword = '') => {
  const statusEl = document.getElementById('status');
  statusEl.textContent = "Đang tải...";

  try {
    const params = new URLSearchParams({ pageSize: 50 });
    if (keyword && keyword.trim() !== '') {
      params.append('q', keyword.trim());
    }
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Lỗi máy chủ hoặc mất kết nối');
    }
    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) {
      statusEl.textContent = "Không có sự kiện nào khớp từ khoá.";
      renderEvents([]);
    } else {
      statusEl.textContent = `Tìm thấy ${data.totalCount !== undefined ? data.totalCount : items.length} sự kiện`;
      renderEvents(items);
    }
  } catch (error) {
    statusEl.textContent = "Không tải được dữ liệu, vui lòng thử lại.";
  }
};
// Khởi chạy khi tải trang, xử lý form tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();

  const searchForm = document.getElementById('search-form');
  const keywordInput = document.getElementById('keyword');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = keywordInput.value.trim();
    loadEvents(keyword);
  });
});