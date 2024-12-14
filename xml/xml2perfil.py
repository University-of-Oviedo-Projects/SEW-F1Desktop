import xml.etree.ElementTree as ET
import numpy as np

def parse_xml():
    try:
        tree = ET.parse("./circuitoEsquema.xml")
        root = tree.getroot()
    except IOError:
        print("No se encuentra el archivo 'circuitoEsquema.xml'")
        return
    
    coordinates = []
    ns = {'ns': 'http://www.uniovi.es'}

    for tramo in root.findall('.//ns:tramo', ns):  
        altitud = float(tramo.find('ns:coordenada/ns:altitud', ns).text) 
        coordinates.append(altitud)
    return coordinates


def smooth_altitudes(altitudes, factor=0.1):
    kernel_size = int(len(altitudes) * factor)

    if kernel_size % 2 == 0:
        kernel_size += 1 
    return np.convolve(altitudes, np.ones(kernel_size)/kernel_size, mode='same')


def create_svg_content(altitudes, width=1400, height=400, margin=50):
    smoothed_altitudes = smooth_altitudes(altitudes)
    min_alt, max_alt = min(smoothed_altitudes), max(smoothed_altitudes)
    alt_range = max_alt - min_alt

    step = (width - 2 * margin) / (len(smoothed_altitudes) - 1)

    svg_content = [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">'
    ]

    points = [f"{margin},{height}"] 

    for i, alt in enumerate(smoothed_altitudes):
        x = margin + i * step
        y = height - margin - ((alt - min_alt) / alt_range * (height - 2 * margin))
        points.append(f"{x},{y}")

    points.append(f"{width - margin},{height}")  
    points.append(f"{margin},{height}")  

    points_str = " ".join(points)
    svg_content.append(f'<polyline points="{points_str}" style="fill:white;stroke:red;stroke-width:4" />')
    svg_content.append('</svg>')

    return "\n".join(svg_content)

def save_svg(svg_content, svg_file):
    with open(svg_file, 'w') as file:
        file.write(svg_content)

def main():
    coordinates = parse_xml()
    svg_content = create_svg_content(coordinates)
    output_svg_path = "./perfil.svg"
    save_svg(svg_content, output_svg_path)

if __name__ == "__main__":
    main()

