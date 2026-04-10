'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pitch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pitches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      promotion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Promotions',
          key: 'id'
        },
        defaultValue: null,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      review_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Reviews',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      booking_date: {
        type: Sequelize.DATEONLY
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      discount_amount:{
        type: Sequelize.DECIMAL(10, 2)
      },
      final_price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      duration_hours: {
        type: Sequelize.DECIMAL(4, 2)
      },
      cancel_at: {
        type: Sequelize.DATE
      },
      cancel_reason: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
