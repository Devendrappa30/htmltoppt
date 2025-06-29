document.addEventListener('DOMContentLoaded', function() {
    const pasteMethod = document.getElementById('pasteMethod');
    const uploadMethod = document.getElementById('uploadMethod');
    const htmlContent = document.getElementById('htmlContent');
    const htmlFile = document.getElementById('htmlFile');
    const fileInfo = document.getElementById('fileInfo');
    const convertBtn = document.getElementById('convertBtn');
    const status = document.getElementById('status');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Switch between paste and upload methods
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const methodId = this.getAttribute('data-method');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected method
            document.querySelectorAll('.method').forEach(method => {
                method.classList.remove('active');
            });
            document.getElementById(methodId).classList.add('active');
        });
    });
    
    // Update file info when file is selected
    htmlFile.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileInfo.textContent = `Selected: ${this.files[0].name}`;
        } else {
            fileInfo.textContent = 'No file selected';
        }
    });
    
    // Handle conversion
    convertBtn.addEventListener('click', async function() {
        status.textContent = 'Processing...';
        status.className = 'status loading';
        
        try {
            const formData = new FormData();
            const options = {
                includeImages: document.getElementById('includeImages').checked,
                preserveStyles: document.getElementById('preserveStyles').checked
            };
            
            formData.append('options', JSON.stringify(options));
            
            if (pasteMethod.classList.contains('active') && htmlContent.value.trim()) {
                formData.append('htmlContent', htmlContent.value);
            } else if (uploadMethod.classList.contains('active') && htmlFile.files.length > 0) {
                formData.append('htmlFile', htmlFile.files[0]);
            } else {
                throw new Error('Please provide HTML content or select a file');
            }
            
            const response = await fetch('/convert', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }
            
            // Handle the file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted-${new Date().getTime()}.pptx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            status.textContent = 'Conversion successful! Download started.';
            status.className = 'status success';
        } catch (error) {
            console.error('Conversion error:', error);
            status.textContent = `Error: ${error.message}`;
            status.className = 'status error';
        }
    });
});
