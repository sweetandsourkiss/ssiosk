package ssiosk.ssiosk.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ssiosk.ssiosk.exception.CustomException;
import ssiosk.ssiosk.exception.ErrorCode;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileUtil {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final AmazonS3 amazonS3;


    public String getFileExt(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }

        int lastDotIdx = filename.lastIndexOf(".");
        if (lastDotIdx != -1) {
            return filename.substring(lastDotIdx + 1);
        } else {
            return "";
        }
    }

    public String saveFile(MultipartFile file) {
        if (file == null) return null;

        String fileName = file.getOriginalFilename();

        String ext = getFileExt(fileName);

        String contentType = "";

        switch (ext) {
            case "jpeg":
                contentType = "image/jpeg";
                break;
            case "png":
                contentType = "image/png";
                break;
            case "jpg":
                contentType = "image/jpg";
                break;
            default:
                throw new CustomException(ErrorCode.INVALID_FILE_ERROR);
        }

        fileName = UUID.randomUUID() + ext;

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);

            amazonS3.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

        } catch (IOException e) {
            e.printStackTrace();
        }

        return amazonS3.getUrl(bucket, fileName).toString();

    }

    public void deleteFile(String url) {
        if(url == null || url.isEmpty()) return;

        int lastIdx = url.lastIndexOf("/");
        String fileName = url.substring(lastIdx + 1);

        boolean isObjectExist = amazonS3.doesObjectExist(bucket, fileName);

        if(isObjectExist) {
            amazonS3.deleteObject(bucket, fileName);
        }

    }

}
