$(document).ready(function() {
    let data = [];

    let alphabeticalFirstNames = [];
    let alphabeticalSurnames = [];
    let alphabeticalEmails = [];
    let departmentsToPersonnel = [];
    let locationsToPersonnel = [];

    let currentDropdown = '';

     $(document).mousedown(function(event){
        if (typeof $(event.target).attr('class') !== 'undefined') {
            if (!$(event.target).attr('class').includes('drop-item')) {
                $('.dropdown-menu-' + currentDropdown).hide();
            }
        } else {
            $('.dropdown-menu-' + currentDropdown).hide();
        }
     })

     $('#filter-button').on('click', () => {
        $('.dropdown-menu-filter').toggle();
     })

     $(document).mousedown(function(event){
        if (typeof $(event.target).attr('class') !== 'undefined') {
            if (!$(event.target).attr('class').includes('filter-drop-item')) {
                $('.dropdown-menu-filter').hide();
            }
        }
    })

    loadData();

    function loadData() {
        $.ajax({
            url: 'libs/php/getAll.php',
            method: 'GET',
            dataType: 'json',
            success: function(result) {
                data = [];
                result.data.forEach(result => {
                    data.push(result);
                })
                 
                 alphabeticalFirstNames = getAlphabetical('firstName').sort((a, b) => a.title.localeCompare(b.title));
                 alphabeticalSurnames = getAlphabetical('lastName').sort((a, b) => a.title.localeCompare(b.title));
                 alphabeticalEmails = getAlphabetical('email').sort((a, b) => a.title.localeCompare(b.title));
                 departmentsToPersonnel = getItems('department');
                 locationsToPersonnel = getItems('location');
                
                 $('body .alphabet-section').html('');

                 let value = $('#sort-select').val();
                 value == 'first-name' ? loadBy('firstnames') : value == 'surname' ? loadBy('surnames') : value == 'email' ? loadBy('emails') : value == 'location' ? loadBy('locations') : loadBy('departments');


                $('.location-select').html('');
                $('.department-select').html('');

                $.ajax({
                    url: 'libs/php/getLocationIDs.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.sort(function(a, b) {
                            return a.name.localeCompare(b.name);
                         });
                        result.data.forEach(location => {
                            $('.location-select').append(`<option value="${location.id}">${location.name}</option>`)
                        })
                    }
                })

                $.ajax({
                    url: 'libs/php/getDepartmentIDs.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.sort(function(a, b) {
                            return a.name.localeCompare(b.name);
                         });
                        result.data.forEach(department => {
                            $('.department-select').append(`<option value="${department.id}">${department.name}</option>`)
                        })
                    }
                })
            },
        })
    }

    function loadLocations() {
        $.ajax({
            url: 'libs/php/getAllLocations.php',
            method: 'GET',
            dataType: 'json',
            async: false,
            success: function(result) {
                let titles = [];
                locationsToPersonnel.forEach(item => {
                    titles.push(item.title);
                });
                result.data.forEach(location => {
                    !titles.includes(location.name) ? locationsToPersonnel.push({title: location.name, data: []}) : null;
                })

                $('.add-location-modal').modal('hide');

            }
        })
    }

    function loadDepartments() {
        $.ajax({
            url: 'libs/php/getAllDepartments.php',
            method: 'GET',
            dataType: 'json',
            async: false,
            success: function(result) {
                let titles = [];
                departmentsToPersonnel.forEach(item => {
                    titles.push(item.title);
                });
                result.data.forEach(department => {
                    !titles.includes(department.name) ? departmentsToPersonnel.push({title: department.name, data: []}) : null;
                })
            }
        })
    }

    function loadBy(order) {
        let section;
        order == 'firstnames' ? section = alphabeticalFirstNames : order == 'surnames' ?  section = alphabeticalSurnames : order == 'emails' ? section = alphabeticalEmails : order == 'locations' ? section = locationsToPersonnel : section = departmentsToPersonnel; 
        section.forEach(section => {
            $('body').append(`<div class="alphabet-section mt-3" data-name="${section.title}">
            <div class="d-flex flex-column">
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <h3 class="alphabet-label">${section.title}</h3>
                    <div class="d-flex justify-content-evenly align-items-center section-edit-remove">
                        <iconify-icon class="section-edit p-1 d-flex justify-content-center align-items-center" icon="material-symbols:edit" data-name="${section.title}"></iconify-icon>
                        <iconify-icon class="section-remove p-1 d-flex justify-content-center align-items-center"icon="mdi:bin" data-name="${section.title}"></iconify-icon>
                    </div>
                </div>
                <span class="alphabet-divider"></span>
            </div>
            <div class="container">
                <div class="row">
                </div>
            </div>
            </div>`)
                for (let i=0; i<section.data.length; i++) {
                    $(`.alphabet-section[data-name='${section.title}'] .row`).append(`<div class="col-6 col-md-4 col-lg-3">
                <div class="card mt-3">
                    <div class="card-head d-flex justify-content-between">
                        <div class="user-icon-container d-flex justify-content-center align-items-center mt-2">
                            <iconify-icon class="user-icon" icon="mdi:user"></iconify-icon>
                        </div>
                        <div class="dropdown">
                            <button class="dots-icon-container mt-1 d-flex align-items-center justify-content-center" data-name="${(section.data[i].email).replace(/[^a-zA-Z0-9 ]/g, '')}">
                                <iconify-icon class="dots-icon" icon="ph:dots-three-outline-light"></iconify-icon>
                            </button> 
                            <div class="dropdown-menu dropdown-menu-${(section.data[i].email).replace(/[^a-zA-Z0-9 ]/g, '')}">
                                <a class="dropdown-item drop-item edit">Edit</a>
                                <a class="dropdown-item drop-item remove">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-around">
                    <h5>${section.data[i].lastName + ", " + section.data[i].firstName}</h5>
                    <div class="department-location-container">
                        <div class="d-flex align-items-center mb-2">
                            <iconify-icon class="department-location-icon" icon="ic:outline-email"></iconify-icon>
                            <span class="email">Email: ${section.data[i].email}</span>
                        </div>
                        <div class="mb-2 d-flex align-items-center">
                            <iconify-icon class="department-location-icon" icon="mdi:building"></iconify-icon>
                            <span>Department: ${section.data[i].department}</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <iconify-icon class="department-location-icon" icon="material-symbols:location-on-outline"></iconify-icon>
                            <span>Location: ${section.data[i].location}</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>`);
            }
        })

        if ($('#sort-select').val() !== 'first-name' && $('#sort-select').val() !== 'surname' && $('#sort-select').val() !== 'email') {
            $('.section-edit-remove').css("opacity", "100%");
        } else {
            $('.section-edit-remove').css({"opacity" : "0%", "pointer-events" : "none"});
        }

        $('.section-edit').on('click', (event) => {
            let value = $('#sort-select').val();

            let name = $(event.currentTarget).attr('data-name');

            if (value == 'department') {
                $('.edit-department-modal').modal('show');
                $.ajax({
                    url: 'libs/php/getAllDepartments.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.forEach(department => {
                            if (department.name == name) {
                                $('.edit-department-modal .department').attr('placeholder', department.name);
                                $('.edit-department-modal .department').val(department.name);
                                $('.edit-department-modal .location').val(department.locationID);
                                editDepartment(department.id);
                            }
                        })

                    },
                })
                $('.close').on('click', () => {
                    $('.edit-department-modal').modal('hide');
                })
            } else {
                $('.edit-location-modal').modal('show');
                $.ajax({
                    url: 'libs/php/getAllLocations.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.forEach(location => {
                            if (location.name == name) {
                                $('.edit-location-modal .location').attr('placeholder', location.name);
                                $('.edit-location-modal .location').val(location.name);
                                $('.edit-location-modal .edit-submit').on('click', () => {
                                    editLocation(location.id);
                                })
                            }
                        })
                    },
                })
                $('.close').on('click', () => {
                    $('.edit-location-modal').modal('hide');
                })
            }
        })

        $('.section-remove').on('click', (event) => {
            let value = $('#sort-select').val();
            let name = $(event.currentTarget).attr('data-name');

            if (value == 'department') {
                $.ajax({
                    url: 'libs/php/getAllDepartments.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.forEach(department => {
                            if (department.name == name) {
                                $('.main-message').html(`Are you sure you want to remove "${department.name}"`);
                                $('.sub-message').html(`This department will be deleted immediately. This action can't be undone`);

                                let containsItems = false;

                                $.ajax({
                                    url: 'libs/php/departmentContainsItems.php',
                                    method: 'POST',
                                    dataType: 'json',
                                    async: false,
                                    data: {
                                        id: department.id
                                    },
                                    success: function(result) {
                                        let count = result.data.personnel[0].pc
                                        if (count > 0) {
                                            containsItems = true;
                                        }
                                    }
                                })

                                if (!containsItems) {
                                    $('.department-remove-modal').modal('show');
                                    $('.department-remove-modal .delete-button').on('click', () => {
                                        loadData();

                                        $.ajax({
                                            url: 'libs/php/deleteDepartmentByID.php',
                                            method: 'POST',
                                            dataType: 'json',
                                            data: {
                                                id: department.id
                                            },
                                            success: function(result) {
                                                let date = new Date(Date.now()).toLocaleString().split(',');
                                                date = date[1].substring(0, 6) + ', ' + date[0];
                                                $('#sort-select').val('department');
    
                                                $('body .alphabet-section').html('');
                                                loadDepartments();
                                                loadBy('departments');
    
                                                let alreadyRun = $('.history-modal tbody').html().includes(`${department.name} successfully removed.`);
    
                                                if (!alreadyRun) {
                                                    $('.history-modal tbody').append(`<tr>
                                                        <td>${department.name} successfully removed.</td>
                                                        <td>${date}</td>
                                                    </tr>`)
                                                }
    
                                                $('.department-remove-modal').modal('hide');
    
                                                $('#liveToast').show();
                                                $('#liveToast .toast-body').html('');
                                                $('#liveToast .toast-body').append(`${department.name} successfully removed.`);
    
                                                $('.btn-close').on('click', () => {
                                                    $('#liveToast').hide();
                                                })
    
                                                setTimeout(() => {
                                                    $('#liveToast').hide();
                                                }, 3000);
                                            }
                                        })
                                    })
                                } else {
                                    $('.department-remove-modal').modal('hide');
                                    $('#liveToast').show();
                                    $('#liveToast .toast-body').html('');
                                    $('#liveToast .toast-body').append(`Cannot delete department with items.`);

                                    $('.btn-close').on('click', () => {
                                        $('#liveToast').hide();
                                    })

                                    setTimeout(() => {
                                        $('#liveToast').hide();
                                    }, 3000);
                                }
                            }
                        })
                        
                    },
                })
                $('.cancel-button').on('click', () => {
                    $('.department-remove-modal').modal('hide');
                })
            } else {
                $.ajax({
                    url: 'libs/php/getAllLocations.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        result.data.forEach(location => {
                            if (location.name == name) {
                                $('.main-message').html(`Are you sure you want to remove "${location.name}"`);
                                $('.sub-message').html(`This location will be deleted immediately. This action can't be undone`);
                                let containsItems = false;

                                $.ajax({
                                    url: 'libs/php/locationContainsItems.php',
                                    method: 'POST',
                                    dataType: 'json',
                                    async: false,
                                    data: {
                                        id: location.id
                                    },
                                    success: function(result) {
                                        let count = result.data.personnel[0].lc
                                        if (count > 0) {
                                            containsItems = true;
                                        }
                                    }
                                })

                                if (!containsItems) {
                                    $('.location-remove-modal').modal('show');
                                    $('.location-remove-modal .delete-button').on('click', () => {
                                        loadData();
                                        $.ajax({
                                            url: 'libs/php/deleteLocationByID.php',
                                            method: 'POST',
                                            dataType: 'json',
                                            data: {
                                                id: location.id
                                            },
                                            success: function(result) {
                                                let date = new Date(Date.now()).toLocaleString().split(',');
                                                date = date[1].substring(0, 6) + ', ' + date[0];
                                                $('#sort-select').val('location');
    
                                                $('body .alphabet-section').html('');
                                                loadLocations();
                                                loadBy('locations');
    
                                                let alreadyRun = $('.history-modal tbody').html().includes(`${location.name} successfully removed.`);
    
                                                if (!alreadyRun) {
                                                    $('.history-modal tbody').append(`<tr>
                                                        <td>${location.name} successfully removed.</td>
                                                        <td>${date}</td>
                                                    </tr>`)
                                                }
    
                                                $('.location-remove-modal').modal('hide');
    
                                                $('#liveToast').show();
                                                $('#liveToast .toast-body').html('');
                                                $('#liveToast .toast-body').append(`${location.name} successfully removed.`);
    
                                                $('.btn-close').on('click', () => {
                                                    $('#liveToast').hide();
                                                })
    
                                                setTimeout(() => {
                                                    $('#liveToast').hide();
                                                }, 3000);
                                            }
                                        })
                                    })
                                } else {
                                    $('.location-remove-modal').modal('hide');
                                    $('#liveToast').show();
                                    $('#liveToast .toast-body').html('');
                                    $('#liveToast .toast-body').append(`Cannot delete location with items.`);

                                    $('.btn-close').on('click', () => {
                                        $('#liveToast').hide();
                                    })

                                    setTimeout(() => {
                                        $('#liveToast').hide();
                                    }, 3000);
                                }
                            }
                        })
                    },
                })
                $('.cancel-button').on('click', () => {
                    $('.location-remove-modal').modal('hide');
                })
            }
        })


        $('.dots-icon-container').on('click', function () {
            currentDropdown = $(this).attr('data-name');
            $(`.dropdown-menu-${currentDropdown}`).toggle();
         });
    
        $('.edit').on('click', () => {
            $('.edit-modal').modal('show');
            $.ajax({
                url: 'libs/php/getAllPersonnel.php',
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    result.data.forEach(person => {
                        if ((person.email).replace(/[^a-zA-Z0-9 ]/g, '') == currentDropdown) {
                            $('.edit-modal .first-name').attr('placeholder', person.firstName);
                            $('.edit-modal .surname').attr('placeholder', person.lastName);
                            $('.edit-modal .email').attr('placeholder', person.email);
                            $('.edit-modal .first-name').val(person.firstName);
                            $('.edit-modal .surname').val(person.lastName);
                            $('.edit-modal .email').val(person.email);
                            $('.edit-modal .department').val(person.departmentID);
                            editPerson(person.id);
                        }
                    })
                    
                }
            })
            
            $('.close').on('click', () => {
                $('.edit-modal').modal('hide');
            })
        })
    
        $('.remove').on('click', () => {
            $(`.dropdown-menu-${currentDropdown}`).hide();
            $('.remove-modal').modal('show');
            $.ajax({
                url: 'libs/php/getAllPersonnel.php',
                method: 'GET',
                dataType: 'json',
                success: function(result) {
                    result.data.forEach(person => {
                        if ((person.email).replace(/[^a-zA-Z0-9 ]/g, '') == currentDropdown) {
                            $('.main-message').html(`Are you sure you want to remove "${person.firstName + ' ' + person.lastName}"`);
                            $('.remove-modal .delete-button').on('click', () => {
                                $.ajax({
                                    url: 'libs/php/deletePersonByID.php',
                                    method: 'POST',
                                    dataType: 'json',
                                    data: {
                                        id: person.id
                                    },
                                    success: function(result) {
                                        let date = new Date(Date.now()).toLocaleString().split(',');
                                        date = date[1].substring(0, 6) + ', ' + date[0];

                                        loadData();

                                        let alreadyRun = $('.history-modal tbody').html().includes(`${person.firstName + ' ' + person.lastName} successfully removed.`);

                                        if (!alreadyRun) {
                                            $('.history-modal tbody').append(`<tr>
                                                <td>${person.firstName + ' ' + person.lastName} successfully removed.</td>
                                                <td>${date}</td>
                                            </tr>`)
                                        }

                                        $('.remove-modal').modal('hide');

                                        $('#liveToast').show();
                                        $('#liveToast .toast-body').html('');
                                        $('#liveToast .toast-body').append(`${person.firstName + ' ' + person.lastName} successfully removed.`);

                                        $('.btn-close').on('click', () => {
                                            $('#liveToast').hide();
                                        })

                                        setTimeout(() => {
                                            $('#liveToast').hide();
                                        }, 3000);
                                    }
                                })
                            })
                        }
                    })
                }
            })
             
            $('.cancel-button').on('click', () => {
                $('.remove-modal').modal('hide');
            })
        })
    }

    function addLocation() {
        let location = $('.add-location-modal .location').val();
        let date = new Date(Date.now()).toLocaleString().split(',');
        date = date[1].substring(0, 6) + ', ' + date[0];
        
        let namePattern = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
        let validLocation = namePattern.test(location);
        let alreadyExists = false;

        data.forEach(item => {
            item.location == location ? alreadyExists = true : null;
        })

        if (validLocation && !alreadyExists) {
            $.ajax({
                url: 'libs/php/insertLocation.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    name: location
                },
                success: function() {
                    $('.add-location-modal .location').val('');
                    $('#sort-select').val('location');

                    $('body .alphabet-section').html('');

                    loadLocations();
                    loadBy('locations');
                    

                    $('.history-modal tbody').append(`<tr>
                        <td>${location} successfully added.</td>
                        <td>${date}</td>
                    </tr>`)

                    $('.add-location-modal').modal('hide');

                    $('#liveToast').show();
                    $('#liveToast .toast-body').html('');
                    $('#liveToast .toast-body').append(`${location} successfully added.`);

                    $('.btn-close').on('click', () => {
                        $('#liveToast').hide();
                    })

                    setTimeout(() => {
                        $('#liveToast').hide();
                    }, 3000);
                }
            })
        } else if (!validLocation) {
            $('.history-modal tbody').append(`<tr>
                <td>Could not be added. Please enter a valid location name.</td>
                <td>${date}</td>
            </tr>`)

            $('.add-location-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid location name.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
        }
    }

    function addDepartment() {
        let department = $('.add-department-modal .department').val();
        let location =  $('.add-department-modal .location').val();
        let date = new Date(Date.now()).toLocaleString().split(',');
        date = date[1].substring(0, 6) + ', ' + date[0];
        
        let namePattern = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
        let validDepartment = namePattern.test(department);
        let alreadyExists = false;

        data.forEach(item => {
            item.department == department ? alreadyExists = true : null;
        })

        if (validDepartment && !alreadyExists) {
            $.ajax({
                url: 'libs/php/insertDepartment.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    name: department,
                    locationID: location
                },
                success: function() {
                    $('.add-department-modal .department').val('');
                    $('#sort-select').val('department');

                    $('body .alphabet-section').html('');

                    loadDepartments();
                    loadBy('departments');
    
                    $('.history-modal tbody').append(`<tr>
                        <td>${department} successfully added.</td>
                        <td>${date}</td>
                    </tr>`)

                    $('.add-department-modal').modal('hide');

                    $('#liveToast').show();
                    $('#liveToast .toast-body').html('');
                    $('#liveToast .toast-body').append(`${department} successfully added.`);

                    $('.btn-close').on('click', () => {
                        $('#liveToast').hide();
                    })

                    setTimeout(() => {
                        $('#liveToast').hide();
                    }, 3000);
                }
            })
        } else if (!validDepartment) {
            $('.history-modal tbody').append(`<tr>
                <td>Could not be added. Please enter a valid department name.</td>
                <td>${date}</td>
            </tr>`)

            $('.add-department-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid department name.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
        }
    }

    function addPerson() {
        let first_name = $('.add-user-modal .first-name').val();
        let surname = $('.add-user-modal .surname').val();
        let email = $('.add-user-modal .email').val();
        let department = $('.add-user-modal .department').val();
        let date = new Date(Date.now()).toLocaleString().split(',');
        date = date[1].substring(0, 6) + ', ' + date[0];

        let namePattern = /^[a-zA-Z'-]+$/;
        let emailPattern = /^\S+@\S+\.\S+$/;

        let validFirstName = namePattern.test(first_name);
        let validSurname = namePattern.test(surname);
        let validEmail = emailPattern.test(email);
        let alreadyExists = false;

        data.forEach(item => {
            item.email == email ? alreadyExists = true : null;
        })

        if (validFirstName && validSurname && validEmail && !alreadyExists) {
            $.ajax({
                url: 'libs/php/insertPerson.php',
                method: 'POST',
                dataType: 'json',
                data: {
                    first_name: first_name,
                    last_name: surname,
                    email: email,
                    departmentID: department
                },
                success: function(result) {
                    $('.add-user-modal .first-name').val('');
                    $('.add-user-modal .surname').val('');
                    $('.add-user-modal .email').val('');

                    loadData();
    
                    $('.history-modal tbody').append(`<tr>
                        <td>${first_name + ' ' + surname} successfully added.</td>
                        <td>${date}</td>
                    </tr>`)

                    $('.add-user-modal').modal('hide');

                    $('#liveToast').show();
                    $('#liveToast .toast-body').html('');
                    $('#liveToast .toast-body').append(`${first_name + ' ' + surname} successfully added.`);

                    $('.btn-close').on('click', () => {
                        $('#liveToast').hide();
                    })

                    setTimeout(() => {
                        $('#liveToast').hide();
                    }, 3000);
    
                }
            }) 
        } else if (!validFirstName) {
            $('.history-modal tbody').append(`<tr>
                <td>Could not be added. Please enter a valid first name.</td>
                <td>${date}</td>
            </tr>`)

            $('.add-user-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid first name.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
        } else if (!validSurname) {
            $('.history-modal tbody').append(`<tr>
                <td>Could not be added. Please enter a valid surname.</td>
                <td>${date}</td>
            </tr>`)

            $('.add-user-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid surname.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
        } else if (!validEmail) {
            $('.history-modal tbody').append(`<tr>
                <td>Could not be added. Please enter a valid email.</td>
                <td>${date}</td>
            </tr>`)

            $('.add-user-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid email.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
        }

    }


    function editPerson(id) {
        $(`.dropdown-menu-${currentDropdown}`).hide();
        $('#edit-user-form').on('submit', (event) => {
            event.preventDefault();
            let first_name = $('.edit-modal .first-name').val();
            let surname = $('.edit-modal .surname').val();
            let email = $('.edit-modal .email').val();
            let department = $('.edit-modal .department').val();
            let personId = id;
            let date = new Date(Date.now()).toLocaleString().split(',');
            date = date[1].substring(0, 6) + ', ' + date[0];

            let namePattern = /^[a-zA-Z'-]+$/;
            let emailPattern = /^\S+@\S+\.\S+$/;

            let validFirstName = namePattern.test(first_name);
            let validSurname = namePattern.test(surname);
            let validEmail = emailPattern.test(email);

            if (validFirstName && validSurname && validEmail) {
                $.ajax({
                    url: 'libs/php/updatePerson.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        first_name: first_name,
                        last_name: surname,
                        email: email,
                        departmentID: department,
                        id: personId
                    },
                    success: function(result) {
                        loadData();
                        $('.edit-modal .first-name').val('');
                        $('.edit-modal .surname').val('');
                        $('.edit-modal .email').val('');

                        $('.edit-modal').modal('hide');

                        $('.history-modal tbody').append(`<tr>
                            <td>${first_name + ' ' + surname} successfully updated.</td>
                            <td>${date}</td>
                        </tr>`)

                        $('#liveToast').show();
                        $('#liveToast .toast-body').html('');
                        $('#liveToast .toast-body').append(`${first_name + ' ' + surname} successfully updated.`);

                        $('.btn-close').on('click', () => {
                            $('#liveToast').hide();
                        })

                        setTimeout(() => {
                            $('#liveToast').hide();
                        }, 3000);
                    }
                })
            } else if (!validFirstName) {
                $('.history-modal tbody').append(`<tr>
                <td>Could not be updated. Please enter a valid first name.</td>
                <td>${date}</td>
                </tr>`)

                $('.edit-modal').modal('hide');

                $('#liveToast').show();
                $('#liveToast .toast-body').html('');
                $('#liveToast .toast-body').append(`Please enter a valid first name.`);

                $('.btn-close').on('click', () => {
                    $('#liveToast').hide();
                })

                setTimeout(() => {
                    $('#liveToast').hide();
                }, 3000);
            } else if (!validSurname) {
                $('.history-modal tbody').append(`<tr>
                <td>Could not be updated. Please enter a valid surname.</td>
                <td>${date}</td>
                </tr>`)

                $('.edit-modal').modal('hide');

                $('#liveToast').show();
                $('#liveToast .toast-body').html('');
                $('#liveToast .toast-body').append(`Please enter a valid surname.`);

                $('.btn-close').on('click', () => {
                    $('#liveToast').hide();
                })
            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
            } else if (!validEmail) {
                $('.history-modal tbody').append(`<tr>
                <td>Could not be updated. Please enter a valid email.</td>
                <td>${date}</td>
            </tr>`)

            $('.edit-modal').modal('hide');

            $('#liveToast').show();
            $('#liveToast .toast-body').html('');
            $('#liveToast .toast-body').append(`Please enter a valid email.`);

            $('.btn-close').on('click', () => {
                $('#liveToast').hide();
            })

            setTimeout(() => {
                $('#liveToast').hide();
            }, 3000);
            }
        })  
    }

    function editDepartment(departmentID) {
        $('#edit-department-form').on('submit', () => {
            let department = $('.edit-department-modal .department').val();
            let depID = departmentID;
            let locID = $('.edit-department-modal .location').val();

            let date = new Date(Date.now()).toLocaleString().split(',');
            date = date[1].substring(0, 6) + ', ' + date[0];

            let namePattern = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

            let validDepartment = namePattern.test(department);

            if (validDepartment) {
                $.ajax({
                    url: 'libs/php/updateDepartment.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        name: department,
                        locationID: locID,
                        id: depID
                    },
                    success: function(result) {
                        $('#sort-select').val('department');

                        loadData();
                        loadDepartments();

                        $('body .alphabet-section').html('');
                        loadBy('departments');

                        $('.edit-department-modal .department').val('');

                        $('.edit-department-modal').modal('hide');

                        $('.history-modal tbody').append(`<tr>
                            <td>${department} successfully updated.</td>
                            <td>${date}</td>
                        </tr>`)

                        $('#liveToast').show();
                        $('#liveToast .toast-body').html('');
                        $('#liveToast .toast-body').append(`${department} successfully updated.`);

                        $('.btn-close').on('click', () => {
                            $('#liveToast').hide();
                        })

                        setTimeout(() => {
                            $('#liveToast').hide();
                        }, 3000);
                    }
                })
            } else if (!validDepartment) {
                $('.history-modal tbody').append(`<tr>
                <td>Please enter a valid department name.</td>
                <td>${date}</td>
                </tr>`)

                $('.edit-modal').modal('hide');

                $('#liveToast').show();
                $('#liveToast .toast-body').html('');
                $('#liveToast .toast-body').append(`Please enter a valid department name.`);

                $('.btn-close').on('click', () => {
                    $('#liveToast').hide();
                })

                setTimeout(() => {
                    $('#liveToast').hide();
                }, 3000);
            } 
        })  
    }

    function editLocation(id) {
            let location = $('.edit-location-modal .location').val();
            let locID = id;
            let date = new Date(Date.now()).toLocaleString().split(',');
            date = date[1].substring(0, 6) + ', ' + date[0];

            let namePattern = /^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

            let validLocation = namePattern.test(location);

            if (validLocation) {
                $.ajax({
                    url: 'libs/php/updateLocation.php',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        name: location,
                        id: locID
                    },
                    success: function(result) {
                        $('#sort-select').val('location');

                        loadData();
                        loadLocations();

                        $('body .alphabet-section').html('');
                        loadBy('locations');

                        $('.edit-location-modal .location').val('');

                        $('.edit-location-modal').modal('hide');

                        $('.history-modal tbody').append(`<tr>
                            <td>${location} successfully updated.</td>
                            <td>${date}</td>
                        </tr>`)

                        $('#liveToast').show();
                        $('#liveToast .toast-body').html('');
                        $('#liveToast .toast-body').append(`${location} successfully updated.`);

                        $('.btn-close').on('click', () => {
                            $('#liveToast').hide();
                        })

                        setTimeout(() => {  
                            $('#liveToast').hide();
                        }, 3000);
                    }
                })
            } else if (!validLocation) {
                $('.history-modal tbody').append(`<tr>
                <td>Please enter a valid location name.</td>
                <td>${date}</td>
                </tr>`)

                $('.edit-modal').modal('hide');

                $('#liveToast').show();
                $('#liveToast .toast-body').html('');
                $('#liveToast .toast-body').append(`Please enter a valid location name.`);

                $('.btn-close').on('click', () => {
                    $('#liveToast').hide();
                })

                setTimeout(() => {
                    $('#liveToast').hide();
                }, 3000);
            } 
    }

    function handleChange(event) {
        $('#sort-select').val('first-name');
        let current = $(event.currentTarget).val()

        if (current.length == 0) {
            loadData();
            loadBy('firstnames');
        }

        $.ajax({
            url: 'libs/php/getMatches.php',
            method: 'POST',
            dataType: 'json',
            data: {
                value: `%${current}%`
            },
            success: function(result) {
                $.ajax({
                    url: 'libs/php/getAll.php',
                    method: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(result) {
                        data = [];
                        result.data.forEach(result => {
                            data.push(result);
                        })
                    }
                })

                let values = [];
                data.forEach(item => {
                    result.data.personnel.forEach(person => {
                        if (person.email == item.email) {
                            values.push(item);
                        }
                    })
                })

                data = values;

                alphabeticalFirstNames = getAlphabetical('firstName').sort((a, b) => a.title.localeCompare(b.title));
                alphabeticalSurnames = getAlphabetical('lastName').sort((a, b) => a.title.localeCompare(b.title));
                alphabeticalEmails = getAlphabetical('email').sort((a, b) => a.title.localeCompare(b.title));

                $('body .alphabet-section').html('');
                loadBy('firstnames');
            }
        })
    }

    const getAlphabetical = (selector) => {
        if (data.length === 0) {
          return [];
        }
        return Object.values(
          data.reduce((acc, item) => {
            let firstLetter = item[selector][0].toLocaleUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = { title: firstLetter, data: [item] };
            } else {
              acc[firstLetter].data.push(item);
            }
            return acc;
          }, {})
        );
     }

     const getItems = (selector) => {
        if (data.length === 0) {
            return [];
          }
          return Object.values(
            data.reduce((acc, item) => {
              let departmentsLocations = item[selector];
              if (!acc[departmentsLocations]) {
                acc[departmentsLocations] = { title: departmentsLocations, data: [item] };
              } else {
                acc[departmentsLocations].data.push(item);
              }
              return acc;

            }, {})
          );
     }


    $('#clear-filters-button').on('click', () => {
        $('input[type=checkbox]').prop("checked", false);
        $('.filters-container input[type=text]').val('');
    })


    $('#add-button').on('click', () => {
        let value = $('#sort-select').val();
        if (value == 'surname' || value == 'first-name' || value == 'email') {
            $('.add-user-modal').modal('show');
            $('.close').on('click', () => {
                $('.add-user-modal .first-name').val('');
                $('.add-user-modal .surname').val('');
                $('.add-user-modal .email').val('');
                $('.add-user-modal').modal('hide');
            })
        } else if (value == 'department') {
            $('.add-department-modal').modal('show');
            $('.close').on('click', () => {
                $('.add-department-modal .department').val('');
                $('.add-department-modal').modal('hide');
            })
        } else if (value == 'location') {
            $('.add-location-modal').modal('show');
            $('.close').on('click', () => {
                $('.add-location-modal .location').val('');
                $('.add-location-modal').modal('hide');
            })
        }
    }) 

    $('#view-history').on('click', () => {
        $('.history-modal').modal('show');
        
        $('.close').on('click', () => {
            $('.history-modal').modal('hide');
        })
    })


    $('#add-user-form').on('submit', (event) => {
        event.preventDefault();
        addPerson();
    })

    $('#add-department-form').on('submit', (event) => {
        event.preventDefault();
        addDepartment();
    })

    $('#add-location-form').on('submit', (event) => {
        event.preventDefault();
        addLocation();
    })

    $('#search-input').on('input', (event) => {
        handleChange(event);
    });

    $('#sort-select').on('change', () => {
        let value = $('#sort-select').val();
        $('body .alphabet-section').html('');
        loadDepartments();
        loadLocations();
        value == 'first-name' ? loadBy('firstnames') : value == 'surname' ? loadBy('surnames') : value == 'email' ? loadBy('emails') : value == 'location' ? loadBy('locations') : loadBy('departments');
     }) 

     setTimeout(() => {
        $('#preloader').hide();
     }, 500);
    
     $(window).on('scroll', (event) => {
        if ($(event.currentTarget).scrollTop() > 0) {
            $('#header').css({"box-shadow" : "0px 3px 10px rgba(0, 0, 0, 0.1)"});
        }
        if ($(event.currentTarget).scrollTop() == 0) {
            $('#header').css({"box-shadow" : "none"});
        }
    })

})
