package com.hris.HRIS.service;

import com.hris.HRIS.model.MultimediaModel;
import com.hris.HRIS.repository.MultimediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MultimediaService {
    @Autowired
    MultimediaRepository multimediaRepository;

    public void toggleLike(String multimediaId, String likeId) {
        MultimediaModel multimedia = multimediaRepository.findById(multimediaId)
                .orElseThrow(() -> new RuntimeException("Multimedia not found"));

        List<String> likes = multimedia.getLikes();

        if (likes.contains(likeId)) {
            // Like ID already in likes array, remove it
            likes.remove(likeId);
        } else {
            // Like ID not in likes array, add it
            likes.add(likeId);
        }

        multimediaRepository.save(multimedia);
    }

    public void saveComment(String multimediaId, String commentId) {
        MultimediaModel multimedia = multimediaRepository.findById(multimediaId)
                .orElseThrow(() -> new RuntimeException("Multimedia not found"));

        List<String> comments = multimedia.getComments();

        comments.add(commentId);
    }

    public void deleteComment(String multimediaId, String commentId) {
        MultimediaModel multimedia = multimediaRepository.findById(multimediaId)
                .orElseThrow(() -> new RuntimeException("Multimedia not found"));

        List<String> comments = multimedia.getComments();

        comments.remove(commentId);
    }

    public void saveShare(String multimediaId, String shareId) {
        MultimediaModel multimedia = multimediaRepository.findById(multimediaId)
                .orElseThrow(() -> new RuntimeException("Multimedia not found"));

        List<String> shares = multimedia.getShares();

        shares.add(shareId);
    }

    public void deleteShare(String multimediaId, String shareId) {
        MultimediaModel multimedia = multimediaRepository.findById(multimediaId)
                .orElseThrow(() -> new RuntimeException("Multimedia not found"));

        List<String> shares = multimedia.getShares();

        shares.remove(shareId);
    }

}
