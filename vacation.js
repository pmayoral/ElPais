/**
 * VacationFlow - Sistema de Gestión de Vacaciones
 * Archivo JavaScript principal con todas las funcionalidades
 * Autor: Sistema VacationFlow
 * Versión: 1.0.0
 */

// ============================================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ============================================================================

// Variables de estado de la aplicación
let currentDate = new Date();
let currentUser = {
    name: 'Admin Demo',
    role: 'admin',
    avatar: 'AD'
};

// Datos de ejemplo - Empleados
let employees = [
    { 
        id: 1, 
        name: 'María García', 
        email: 'maria@company.com', 
        department: 'desarrollo', 
        role: 'employee', 
        avatar: 'MG', 
        status: 'vacation', 
        vacationDays: 22, 
        usedDays: 8 
    },
    { 
        id: 2, 
        name: 'Juan López', 
        email: 'juan@company.com', 
        department: 'desarrollo', 
        role: 'manager', 
        avatar: 'JL', 
        status: 'available', 
        vacationDays: 25, 
        usedDays: 5 
    },
    { 
        id: 3, 
        name: 'Ana Sánchez', 
        email: 'ana@company.com', 
        department: 'diseño', 
        role: 'employee', 
        avatar: 'AS', 
        status: 'sick', 
        vacationDays: 22, 
        usedDays: 12 
    },
    { 
        id: 4, 
        name: 'Carlos Fernández', 
        email: 'carlos@company.com', 
        department: 'desarrollo', 
        role: 'employee', 
        avatar: 'CF', 
        status: 'available', 
        vacationDays: 22, 
        usedDays: 3 
    },
    { 
        id: 5, 
        name: 'Laura Martín', 
        email: 'laura@company.com', 
        department: 'desarrollo', 
        role: 'employee', 
        avatar: 'LM', 
        status: 'vacation', 
        vacationDays: 22, 
        usedDays: 15 
    }
];

// Datos de ejemplo - Solicitudes de vacaciones
let vacationRequests = [
    { 
        id: 1, 
        employeeId: 1, 
        type: 'vacation', 
        startDate: '2025-06-15', 
        endDate: '2025-06-20', 
        status: 'approved', 
        comments: 'Vacaciones de verano' 
    },
    { 
        id: 2, 
        employeeId: 3, 
        type: 'sick', 
        startDate: '2025-06-10', 
        endDate: '2025-06-12', 
        status: 'approved', 
        comments: 'Gripe' 
    },
    { 
        id: 3, 
        employeeId: 5, 
        type: 'vacation', 
        startDate: '2025-06-18', 
        endDate: '2025-06-25', 
        status: 'pending', 
        comments: 'Viaje familiar' 
    },
    { 
        id: 4, 
        employeeId: 2, 
        type: 'personal', 
        startDate: '2025-06-22', 
        endDate: '2025-06-22', 
        status: 'pending', 
        comments: 'Asuntos personales' 
    }
];

// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

/**
 * Inicializa la aplicación cuando se carga el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    generateCalendar();
    populateEmployeesList();
    populateRequestsList();
    
    // Agregar event listeners para formularios
    document.getElementById('vacation-form').addEventListener('submit', handleVacationSubmit);
    document.getElementById('employee-form').addEventListener('submit', handleEmployeeSubmit);
    
    // Inicializar funcionalidades adicionales
    setTimeout(() => {
        initializeTooltips();
        initializeAutoSave();
        simulateRealTimeUpdates();
        addDynamicStyles();
    }, 1000);
});

/**
 * Configura los event listeners y funcionalidades básicas de la aplicación
 */
function initializeApp() {
    // Event listeners para navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los enlaces
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Añadir clase activa al enlace clickeado
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });

    // Atajos de teclado
    initializeKeyboardShortcuts();
}

/**
 * Configura los atajos de teclado de la aplicación
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N para nueva solicitud
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            showNewRequestModal();
        }
        
        // Escape para cerrar modales
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
}

// ============================================================================
// GESTIÓN DE NAVEGACIÓN Y SECCIONES
// ============================================================================

/**
 * Muestra la sección especificada y oculta las demás
 * @param {string} sectionName - Nombre de la sección a mostrar
 */
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('fade-in');
    }
    
    // Actualizar título de página
    updatePageTitle(sectionName);
}

/**
 * Actualiza el título y subtítulo de la página según la sección activa
 * @param {string} sectionName - Nombre de la sección activa
 */
function updatePageTitle(sectionName) {
    const titles = {
        'dashboard': 'Dashboard Principal',
        'calendar': 'Calendario de Vacaciones',
        'employees': 'Gestión de Empleados',
        'requests': 'Solicitudes de Vacaciones',
        'reports': 'Reportes y Análisis',
        'settings': 'Configuración del Sistema'
    };
    
    const subtitles = {
        'dashboard': 'Resumen general del sistema',
        'calendar': 'Vista completa del calendario de ausencias',
        'employees': 'Administrar empleados y sus permisos',
        'requests': 'Gestionar solicitudes de vacaciones',
        'reports': 'Análisis y estadísticas',
        'settings': 'Configuración y preferencias'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
    document.getElementById('page-subtitle').textContent = subtitles[sectionName] || '';
}

// ============================================================================
// GESTIÓN DEL CALENDARIO
// ============================================================================

/**
 * Genera y muestra el calendario principal con indicadores de vacaciones
 */
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    // Limpiar calendario existente
    calendarGrid.innerHTML = '';
    
    // Crear encabezados de días de la semana
    createCalendarHeaders(calendarGrid);
    
    // Generar días del calendario
    generateCalendarDays(calendarGrid);
}

/**
 * Crea los encabezados de días de la semana para el calendario
 * @param {HTMLElement} calendarGrid - Elemento contenedor del calendario
 */
function createCalendarHeaders(calendarGrid) {
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.style.cssText = `
            background: var(--dark-bg);
            color: white;
            padding: 1rem;
            text-align: center;
            font-weight: 600;
            font-size: 0.875rem;
        `;
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
}

/**
 * Genera los días del calendario con indicadores de vacaciones
 * @param {HTMLElement} calendarGrid - Elemento contenedor del calendario
 */
function generateCalendarDays(calendarGrid) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generar 42 días (6 semanas) para mostrar el calendario completo
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Marcar días de otros meses
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        dayElement.innerHTML = `
            <div class="calendar-day-number">${date.getDate()}</div>
            <div class="vacation-indicators">${getVacationIndicators(date)}</div>
        `;
        
        calendarGrid.appendChild(dayElement);
    }
}

/**
 * Obtiene los indicadores de vacaciones para una fecha específica
 * @param {Date} date - Fecha para verificar vacaciones
 * @returns {string} HTML con los indicadores de vacaciones
 */
function getVacationIndicators(date) {
    const dateString = date.toISOString().split('T')[0];
    let indicators = '';
    
    // Verificar solicitudes de vacaciones aprobadas para esta fecha
    vacationRequests.forEach(request => {
        if (request.status === 'approved' && 
            dateString >= request.startDate && 
            dateString <= request.endDate) {
            indicators += `<div class="vacation-indicator vacation-type-${request.type}"></div>`;
        }
    });
    
    return indicators;
}

/**
 * Navega al mes anterior en el calendario
 */
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
    updateCalendarTitle();
}

/**
 * Navega al mes siguiente en el calendario
 */
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
    updateCalendarTitle();
}

/**
 * Actualiza el título del calendario con el mes y año actuales
 */
function updateCalendarTitle() {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const title = `Calendario de Vacaciones - ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    const titleElements = document.querySelectorAll('.calendar-title');
    titleElements.forEach(el => el.textContent = title);
}

/**
 * Cambia el mes del calendario según la selección del usuario
 */
function changeMonth() {
    const monthSelector = document.getElementById('month-selector');
    const selectedMonth = parseInt(monthSelector.value);
    currentDate.setMonth(selectedMonth);
    generateCalendar();
}

/**
 * Cambia la vista del calendario (mensual, semanal, diaria)
 */
function changeView() {
    const viewSelector = document.getElementById('view-selector');
    const selectedView = viewSelector.value;
    showNotification(`Cambiando a vista ${selectedView}`, 'info');
}

// ============================================================================
// GESTIÓN DE EMPLEADOS
// ============================================================================

/**
 * Popula la lista de empleados en la interfaz
 */
function populateEmployeesList() {
    const employeesList = document.getElementById('employees-list');
    if (!employeesList) return;
    
    employeesList.innerHTML = '';
    
    employees.forEach(employee => {
        const employeeElement = createEmployeeElement(employee);
        employeesList.appendChild(employeeElement);
    });
}

/**
 * Crea un elemento HTML para mostrar información de un empleado
 * @param {Object} employee - Objeto con datos del empleado
 * @returns {HTMLElement} Elemento HTML del empleado
 */
function createEmployeeElement(employee) {
    const statusClass = `status-${employee.status}`;
    const statusText = {
        'available': 'Disponible',
        'vacation': 'En Vacaciones',
        'sick': 'Baja Médica'
    };
    
    const employeeElement = document.createElement('div');
    employeeElement.className = 'employee-item';
    employeeElement.innerHTML = `
        <div class="employee-avatar">${employee.avatar}</div>
        <div class="employee-info">
            <div class="employee-name">${employee.name}</div>
            <div class="employee-role">${employee.department} - ${employee.role}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Días usados: ${employee.usedDays}/${employee.vacationDays}
            </div>
        </div>
        <div class="employee-status ${statusClass}">${statusText[employee.status]}</div>
        <button class="btn btn-secondary" style="margin-left: 1rem; padding: 0.5rem;" onclick="editEmployee(${employee.id})">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
        </button>
    `;
    
    return employeeElement;
}

/**
 * Abre el modal para editar un empleado específico
 * @param {number} employeeId - ID del empleado a editar
 */
function editEmployee(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    // Poblar formulario con datos del empleado
    document.getElementById('employee-name').value = employee.name;
    document.getElementById('employee-email').value = employee.email;
    document.getElementById('employee-department').value = employee.department;
    document.getElementById('employee-role').value = employee.role;
    document.getElementById('employee-vacation-days').value = employee.vacationDays;
    
    showEmployeeModal();
}

/**
 * Filtra la lista de empleados según el término de búsqueda
 */
function filterEmployees() {
    const searchTerm = document.getElementById('employee-search').value.toLowerCase();
    const employeeItems = document.querySelectorAll('#employees-list .employee-item');
    
    employeeItems.forEach(item => {
        const name = item.querySelector('.employee-name').textContent.toLowerCase();
        const role = item.querySelector('.employee-role').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || role.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ============================================================================
// GESTIÓN DE SOLICITUDES DE VACACIONES
// ============================================================================

/**
 * Popula la lista de solicitudes de vacaciones
 */
function populateRequestsList() {
    const requestsList = document.getElementById('requests-list');
    if (!requestsList) return;
    
    requestsList.innerHTML = '';
    
    vacationRequests.forEach(request => {
        const requestElement = createRequestElement(request);
        if (requestElement) {
            requestsList.appendChild(requestElement);
        }
    });
}

/**
 * Crea un elemento HTML para mostrar una solicitud de vacaciones
 * @param {Object} request - Objeto con datos de la solicitud
 * @returns {HTMLElement|null} Elemento HTML de la solicitud o null si no se encuentra el empleado
 */
function createRequestElement(request) {
    const employee = employees.find(emp => emp.id === request.employeeId);
    if (!employee) return null;
    
    const statusClass = `status-${request.status}`;
    const statusText = {
        'pending': 'Pendiente',
        'approved': 'Aprobada',
        'rejected': 'Rechazada'
    };
    
    const typeText = {
        'vacation': 'Vacaciones',
        'sick': 'Baja Médica',
        'personal': 'Asuntos Personales',
        'maternity': 'Baja Maternal',
        'paternity': 'Baja Paternal'
    };
    
    const requestElement = document.createElement('div');
    requestElement.className = 'employee-item';
    requestElement.style.marginBottom = '1rem';
    
    requestElement.innerHTML = `
        <div class="employee-avatar">${employee.avatar}</div>
        <div class="employee-info">
            <div class="employee-name">${employee.name}</div>
            <div class="employee-role">${typeText[request.type]} - ${request.startDate} a ${request.endDate}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">
                ${request.comments || 'Sin comentarios'}
            </div>
        </div>
        <div class="employee-status ${statusClass}">${statusText[request.status]}</div>
        ${request.status === 'pending' ? createRequestActions(request.id) : ''}
    `;
    
    return requestElement;
}

/**
 * Crea los botones de acción para solicitudes pendientes
 * @param {number} requestId - ID de la solicitud
 * @returns {string} HTML con botones de aprobar/rechazar
 */
function createRequestActions(requestId) {
    return `
        <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
            <button class="btn btn-primary" style="padding: 0.5rem;" onclick="approveRequest(${requestId})">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
            </button>
            <button class="btn btn-secondary" style="padding: 0.5rem; background: var(--danger-color); border-color: var(--danger-color);" onclick="rejectRequest(${requestId})">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
            </button>
        </div>
    `;
}

/**
 * Aprueba una solicitud de vacaciones
 * @param {number} requestId - ID de la solicitud a aprobar
 */
function approveRequest(requestId) {
    const request = vacationRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
        showNotification('Solicitud aprobada', 'success');
        populateRequestsList();
        generateCalendar();
    }
}

/**
 * Rechaza una solicitud de vacaciones
 * @param {number} requestId - ID de la solicitud a rechazar
 */
function rejectRequest(requestId) {
    const request = vacationRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected';
        showNotification('Solicitud rechazada', 'warning');
        populateRequestsList();
        generateCalendar();
    }
}

/**
 * Filtra las solicitudes según el estado seleccionado
 */
function filterRequests() {
    const status = document.getElementById('status-filter').value;
    // Implementar filtrado real basado en el estado
    populateRequestsList();
}

// ============================================================================
// GESTIÓN DE MODALES
// ============================================================================

/**
 * Muestra el modal para crear nueva solicitud de vacaciones
 */
function showNewRequestModal() {
    document.getElementById('new-request-modal').classList.add('show');
}

/**
 * Muestra el modal para gestión de empleados
 */
function showEmployeeModal() {
    document.getElementById('employee-modal').classList.add('show');
}

/**
 * Muestra el modal para añadir un nuevo empleado
 */
function showAddEmployeeModal() {
    // Limpiar formulario
    document.getElementById('employee-form').reset();
    showEmployeeModal();
}

/**
 * Cierra un modal específico
 * @param {string} modalId - ID del modal a cerrar
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

/**
 * Muestra el modal de solicitudes (función placeholder)
 */
function showRequestsModal() {
    showNotification('Modal de solicitudes próximamente', 'info');
}

// ============================================================================
// MANEJADORES DE FORMULARIOS
// ============================================================================

/**
 * Maneja el envío del formulario de solicitud de vacaciones
 * @param {Event} e - Evento del formulario
 */
function handleVacationSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('absence-type').value,
        employee: document.getElementById('employee-select').value,
        startDate: document.getElementById('start-date').value,
        endDate: document.getElementById('end-date').value,
        comments: document.getElementById('comments').value
    };
    
    // Simular añadir la solicitud
    const newRequest = {
        id: vacationRequests.length + 1,
        employeeId: employees.find(emp => emp.name.toLowerCase().replace(' ', '-') === formData.employee)?.id || 1,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'pending',
        comments: formData.comments
    };
    
    vacationRequests.push(newRequest);
    
    // Mostrar mensaje de éxito
    showNotification('Solicitud enviada correctamente', 'success');
    
    // Cerrar modal y refrescar datos
    closeModal('new-request-modal');
    document.getElementById('vacation-form').reset();
    populateRequestsList();
    generateCalendar();
}

/**
 * Maneja el envío del formulario de empleado
 * @param {Event} e - Evento del formulario
 */
function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('employee-name').value,
        email: document.getElementById('employee-email').value,
        department: document.getElementById('employee-department').value,
        role: document.getElementById('employee-role').value,
        vacationDays: parseInt(document.getElementById('employee-vacation-days').value)
    };
    
    // Simular añadir/actualizar empleado
    const newEmployee = {
        id: employees.length + 1,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        avatar: formData.name.split(' ').map(n => n[0]).join(''),
        status: 'available',
        vacationDays: formData.vacationDays,
        usedDays: 0
    };
    
    employees.push(newEmployee);
    
    // Mostrar mensaje de éxito
    showNotification('Empleado agregado correctamente', 'success');
    
    // Cerrar modal y refrescar datos
    closeModal('employee-modal');
    document.getElementById('employee-form').reset();
    populateEmployeesList();
}

// ============================================================================
// FUNCIONES DE UTILIDAD Y NOTIFICACIONES
// ============================================================================

/**
 * Muestra una notificación temporal en la interfaz
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, warning, info, error)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        'success': 'var(--success-color)',
        'warning': 'var(--warning-color)', 
        'error': 'var(--danger-color)',
        'info': 'var(--primary-color)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// FUNCIONES ADICIONALES
// ============================================================================

/**
 * Exporta un reporte (función simulada)
 */
function exportReport() {
    showNotification('Exportando reporte...', 'info');
    
    // Simular export
    setTimeout(() => {
        showNotification('Reporte exportado correctamente', 'success');
    }, 2000);
}

/**
 * Gestiona equipos (función placeholder)
 */
function manageTeams() {
    showNotification('Funcionalidad de gestión de equipos próximamente', 'info');
}

/**
 * Inicializa tooltips para elementos con título
 */
function initializeTooltips() {
    const buttons = document.querySelectorAll('button[title]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            // Implementar funcionalidad de tooltip si se necesita
        });
    });
}

/**
 * Inicializa la funcionalidad de auto-guardado para formularios
 */
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Auto-guardar en localStorage si es necesario
                const formId = form.id;
                const inputId = input.id;
                const value = input.value;
                
                if (formId && inputId) {
                    const key = `${formId}_${inputId}`;
                    localStorage.setItem(key, value);
                }
            });
        });
    });
}

/**
 * Simula actualizaciones en tiempo real del estado de empleados
 */
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simular cambios aleatorios de estado
        const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
        const statuses = ['available', 'vacation', 'sick'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (randomEmployee.status !== randomStatus) {
            randomEmployee.status = randomStatus;
            
            // Actualizar UI si estamos en la sección de empleados
            if (document.getElementById('employees-section').style.display !== 'none') {
                populateEmployeesList();
            }
        }
    }, 30000); // Actualizar cada 30 segundos
}

// ============================================================================
// ESTILOS DINÁMICOS Y ANIMACIONES
// ============================================================================

/**
 * Añade estilos CSS dinámicos para animaciones
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .calendar-day-header {
            background: var(--dark-bg) !important;
            color: white !important;
            padding: 1rem !important;
            text-align: center !important;
            font-weight: 600 !important;
            font-size: 0.875rem !important;
        }
        
        .vacation-indicators {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            margin-top: 0.5rem;
        }
        
        .employee-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .stats-card:hover .stats-value {
            color: var(--primary-color);
            transition: color 0.3s ease;
        }
        
        .btn:active {
            transform: translateY(1px);
        }
        
        .modal-content {
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .form-input:hover, .form-select:hover {
            border-color: var(--primary-color);
        }
        
        .calendar-day:hover .calendar-day-number {
            color: var(--primary-color);
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
} 