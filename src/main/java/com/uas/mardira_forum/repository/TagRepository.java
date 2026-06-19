package com.uas.mardira_forum.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uas.mardira_forum.model.Tags;
@Repository
public interface TagRepository extends JpaRepository<Tags,Long>{
    Optional<Tags> findByName(String name);

    boolean existsByName(String name);
}
