// Get a random bible verse every hour

const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const booksApi = 'https://getbible.net/v2/elberfelder/books.json';
const chapterDiv = document.getElementById('chapter-container');
let bookList = null;

fetch(booksApi).then(response => response.json()).then(books => {
    bookList = [];
    for (const key in books) {
        bookList.push(books[key]);
    }

    // Set the interval to refresh every day at midnight
    displayRandomChapter();
    setTimeout(() => {
        setInterval(displayRandomChapter, 86400000);
        displayRandomChapter();
    }, (new Date().setHours(24, 0, 0, 0) - Date.now()));

}).catch(error => {
    console.error(error);
});

async function displayRandomChapter() {
    if(bookList == null) return;
    const bookURL = bookList[Math.floor(Math.random() * bookList.length)].url;
    const response = await fetch(bookURL);
    const book = await response.json();
    chapterDiv.innerHTML = '';

    // Create the page heading
    let chapterText = `<p class="page-title">Dein Bibel Vers für ${days[new Date().getDay()]}, ${new Date().toLocaleDateString('de-AT')}</p>\n`;

    // Get a random chapter of the book
    const chapter = book.chapters[Math.floor(Math.random() * book.chapters.length)];
    console.log(chapter);

    chapter.verses.forEach(verse => {
        chapterText += `<p class="verse"><span class="verse-number">${verse.verse}</span> ${verse.text}</p>\n`;
    });
    chapterText += `<p class="chapter-title">${chapter.name}</p>\n`;
    chapterDiv.innerHTML = chapterText;
}