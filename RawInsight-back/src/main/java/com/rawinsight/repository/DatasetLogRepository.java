package com.rawinsight.repository;

import com.rawinsight.model.DatasetLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetLogRepository extends JpaRepository<DatasetLog, Long> {
    // Spring Data JPA handles baseline CRUD automatically
}