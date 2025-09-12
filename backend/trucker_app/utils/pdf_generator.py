from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime, time

def generate_daily_log_pdf(daily_log):
    """
    Generate a PDF for the daily log sheet following FMCSA requirements
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), 
                          rightMargin=0.5*inch, leftMargin=0.5*inch,
                          topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Build content
    story = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=12,
        alignment=1  # Center
    )
    
    story.append(Paragraph("U.S. DEPARTMENT OF TRANSPORTATION", title_style))
    story.append(Paragraph("DRIVER'S DAILY LOG", title_style))
    story.append(Paragraph("(ONE CALENDAR DAY — 24 HOURS)", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Header information table
    header_data = [
        ['DATE:', daily_log.date.strftime('%m/%d/%Y'), 'TOTAL MILES DRIVING TODAY:', str(daily_log.total_miles)],
        ['NAME OF CARRIER:', daily_log.carrier_name, '', ''],
        ['MAIN OFFICE ADDRESS:', daily_log.main_office_address, '', ''],
        ['DRIVER\'S SIGNATURE:', daily_log.driver_name, 'NAME OF CO-DRIVER:', daily_log.co_driver_name],
        ['VEHICLE NUMBERS:', daily_log.vehicle_number, 'TOTAL HOURS:', '24']
    ]
    
    header_table = Table(header_data, colWidths=[1.5*inch, 2.5*inch, 1.5*inch, 2*inch])
    header_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
    ]))
    
    story.append(header_table)
    story.append(Spacer(1, 12))
    
    # Main log grid
    story.append(create_log_grid(daily_log))
    story.append(Spacer(1, 12))
    
    # Remarks section
    remarks_data = [['REMARKS', '']]
    for entry in daily_log.log_entries.all():
        if entry.remarks:
            remarks_data.append([f"{entry.start_time.strftime('%H:%M')} - {entry.location}", entry.remarks])
    
    if len(remarks_data) == 1:
        remarks_data.append(['', ''])
    
    remarks_table = Table(remarks_data, colWidths=[2*inch, 6*inch])
    remarks_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
    ]))
    
    story.append(remarks_table)
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

def create_log_grid(daily_log):
    """
    Create the 24-hour log grid
    """
    # Create hour headers
    hours = ['Midnight'] + [str(i) for i in range(1, 12)] + ['Noon'] + [str(i) for i in range(13, 24)]
    
    # Create the grid data
    grid_data = []
    
    # Header row
    grid_data.append([''] + hours)
    
    # Duty status rows
    duty_status_labels = ['Off Duty', 'Sleeper Berth', 'Driving', 'On Duty (Not Driving)']
    
    for status_label in duty_status_labels:
        row = [status_label]
        
        # Create 24 hour cells
        for hour in range(24):
            cell_content = get_cell_content_for_hour(daily_log, status_label, hour)
            row.append(cell_content)
        
        # Add totals column
        total = get_total_for_status(daily_log, status_label)
        row.append(f"{total:.1f}")
        
        grid_data.append(row)
    
    # Create table
    col_widths = [1.2*inch] + [0.3*inch] * 24 + [0.5*inch]
    
    grid_table = Table(grid_data, colWidths=col_widths, rowHeights=0.3*inch)
    
    # Style the table
    table_style = [
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),  # Header
        ('BACKGROUND', (0, 1), (0, -1), colors.lightgrey),  # Status labels
    ]
    
    grid_table.setStyle(TableStyle(table_style))
    
    return grid_table

def get_cell_content_for_hour(daily_log, status_label, hour):
    """
    Get content for a specific hour cell based on log entries
    """
    status_mapping = {
        'Off Duty': 'off_duty',
        'Sleeper Berth': 'sleeper_berth',
        'Driving': 'driving',
        'On Duty (Not Driving)': 'on_duty_not_driving'
    }
    
    target_status = status_mapping.get(status_label)
    if not target_status:
        return ''
    
    # Check if any log entry covers this hour
    for entry in daily_log.log_entries.all():
        if entry.duty_status == target_status:
            start_hour = entry.start_time.hour
            end_hour = entry.end_time.hour
            
            # Handle overnight periods
            if end_hour < start_hour:
                if hour >= start_hour or hour <= end_hour:
                    return '●'
            else:
                if start_hour <= hour < end_hour:
                    return '●'
    
    return ''

def get_total_for_status(daily_log, status_label):
    """
    Get total hours for a duty status
    """
    status_mapping = {
        'Off Duty': daily_log.total_hours_off_duty,
        'Sleeper Berth': daily_log.total_hours_sleeper_berth,
        'Driving': daily_log.total_hours_driving,
        'On Duty (Not Driving)': daily_log.total_hours_on_duty_not_driving
    }
    
    return status_mapping.get(status_label, 0)
