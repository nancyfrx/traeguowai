package com.testplatform.backend.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.sl.extractor.SlideShowExtractor;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.apache.poi.xssf.extractor.XSSFExcelExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileParserService {

    public String parseFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null) return "";

        String lowerName = filename.toLowerCase();
        try {
            if (lowerName.endsWith(".pdf")) {
                return parsePdf(file);
            } else if (lowerName.endsWith(".docx")) {
                return parseDocx(file);
            } else if (lowerName.endsWith(".xlsx")) {
                return parseXlsx(file);
            } else if (lowerName.endsWith(".pptx")) {
                return parsePptx(file);
            } else if (isImage(lowerName)) {
                return parseImage(file);
            } else if (isTextFile(lowerName)) {
                return new String(file.getBytes());
            }
        } catch (Throwable e) {
            e.printStackTrace();
            return "Error parsing file " + filename + ": " + e.getMessage();
        }
        return "";
    }

    private boolean isImage(String name) {
        return name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") || 
               name.endsWith(".bmp") || name.endsWith(".gif") || name.endsWith(".webp");
    }

    private boolean isTextFile(String name) {
        return name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".json") || 
               name.endsWith(".csv") || name.endsWith(".xml") || name.endsWith(".java") || 
               name.endsWith(".py") || name.endsWith(".js") || name.endsWith(".html");
    }

    private String parsePdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String parseDocx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XWPFDocument doc = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }

    private String parseXlsx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XSSFWorkbook workbook = new XSSFWorkbook(is);
             XSSFExcelExtractor extractor = new XSSFExcelExtractor(workbook)) {
            return extractor.getText();
        }
    }

    private String parsePptx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XMLSlideShow ppt = new XMLSlideShow(is);
             SlideShowExtractor extractor = new SlideShowExtractor(ppt)) {
            return extractor.getText();
        }
    }

    private String parseImage(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("ocr-", file.getOriginalFilename());
        file.transferTo(tempFile);

        try {
            ITesseract instance = new Tesseract();
            
            // Detect OS and set paths accordingly
            String osName = System.getProperty("os.name").toLowerCase();
            if (osName.contains("mac")) {
                // macOS (Homebrew)
                System.setProperty("jna.library.path", "/usr/local/lib");
                instance.setDatapath("/usr/local/share/tessdata");
            } else if (osName.contains("nix") || osName.contains("nux") || osName.contains("aix")) {
                // Linux (CentOS/Ubuntu)
                // JNA typically finds libs in /usr/lib64 or /usr/lib automatically.
                // We mainly need to locate tessdata.
                File commonTessData = new File("/usr/share/tesseract/tessdata"); // CentOS/RHEL (EPEL)
                if (commonTessData.exists()) {
                    instance.setDatapath(commonTessData.getAbsolutePath());
                } else {
                    File altTessData = new File("/usr/share/tessdata"); // Ubuntu/Debian
                    if (altTessData.exists()) {
                        instance.setDatapath(altTessData.getAbsolutePath());
                    }
                }
            }
            
            // Set language to English + Chinese Simplified
            instance.setLanguage("eng+chi_sim"); 
            
            return instance.doOCR(tempFile);
        } catch (Throwable e) {
            // Catch Throwable to handle NoClassDefFoundError/UnsatisfiedLinkError if native libs are missing
            e.printStackTrace();
            return " [图片识别失败: OCR组件未正确初始化或缺少系统依赖 (" + e.getMessage() + ")] ";
        } finally {
            tempFile.delete();
        }
    }
}
