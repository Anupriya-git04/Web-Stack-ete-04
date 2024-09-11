document.addEventListener('DOMContentLoaded', () => {
    const courseContainer = document.getElementById('courseContainer');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const courseSelect = document.getElementById('courseSelect');
    const signupForm = document.getElementById('signupForm');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
  
    let courses = [];
    let currentPage = 1;
    const itemsPerPage = 3; // Number of courses per page
  
    // Fetch course data from JSON file
    fetch('courses.json')
      .then(response => response.json())
      .then(data => {
        courses = data;
        displayCourses(paginateCourses(courses, currentPage));
        populateCourseSelect(courses);
        updatePageInfo();
      })
      .catch(error => console.error('Error fetching course data:', error));
  
    // Display courses in the course container
    function displayCourses(courseList) {
      courseContainer.innerHTML = '';
      courseList.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course');
        courseDiv.innerHTML = `
          <h3>${course.title}</h3>
          <p>Instructor: ${course.instructor}</p>
          <p>Duration: ${course.duration}</p>
          <p>Rating: ${course.rating}</p>
          <p>Price: ${course.price}</p>
          <p>Enrolled: ${course.enrolled}</p>
        `;
        courseContainer.appendChild(courseDiv);
      });
    }
  
    // Paginate the course data
    function paginateCourses(courseList, page) {
      const start = (page - 1) * itemsPerPage;
      const end = page * itemsPerPage;
      return courseList.slice(start, end);
    }
  
    // Populate the course select dropdown for the signup form
    function populateCourseSelect(courseList) {
      courseSelect.innerHTML = '';
      courseList.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseId;
        option.textContent = course.title;
        courseSelect.appendChild(option);
      });
    }
  
    // Search courses by title
    searchInput.addEventListener('input', () => {
      const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchInput.value.toLowerCase())
      );
      currentPage = 1; // Reset to first page when searching
      displayCourses(paginateCourses(filteredCourses, currentPage));
      updatePageInfo();
    });
  
    // Sort courses by selected attribute
    sortSelect.addEventListener('change', () => {
      const sortedCourses = [...courses].sort((a, b) => {
        const sortKey = sortSelect.value;
        if (sortKey === 'price') {
          return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
        }
        return a[sortKey] > b[sortKey] ? 1 : -1;
      });
      displayCourses(paginateCourses(sortedCourses, currentPage));
    });
  
    // Handle course signup form submission
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const selectedCourseId = courseSelect.value;
  
      alert(`Thank you for signing up, ${name}! You have registered for course ID: ${selectedCourseId}.`);
    });
  
    // Update pagination info
    function updatePageInfo() {
      pageInfo.textContent = `Page ${currentPage}`;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === Math.ceil(courses.length / itemsPerPage);
    }
  
    // Handle Next page button click
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      displayCourses(paginateCourses(courses, currentPage));
      updatePageInfo();
    });
  
    // Handle Previous page button click
    prevPageBtn.addEventListener('click', () => {
      currentPage--;
      displayCourses(paginateCourses(courses, currentPage));
      updatePageInfo();
    });
  });
  