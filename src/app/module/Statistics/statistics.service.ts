/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { Post } from '../Post/post.model';

export const statisticsForAdmin = async () => {
    // Total number of active, non-deleted, and non-blocked posts
    const postCount = await Post.countDocuments({
        isDeleted: false,
        isBlocked: false
    });

    // Total number of active, non-deleted, and non-blocked users
    const userCount = await User.countDocuments({
        isDeleted: false,
        isBlocked: false
    });

    // Total number of verified users
    const verifiedUserCount = await User.countDocuments({
        isDeleted: false,
        isBlocked: false,
        verified: true
    });

    // Total subscription revenue calculation based on active subscriptions
    const subscriptionRevenueResult = await User.aggregate([
        {
            $match: {
                "paymentInfo.subscriptionStatus": "active",
                isDeleted: false,
                isBlocked: false,
                verified: true
            }
        },
        {
            $group: {
                _id: null,
                activeSubscriptionCount: { $sum: 1 } // Count each active subscription
            }
        },
        {
            $project: {
                totalSubscriptionRevenue: { $multiply: ['$activeSubscriptionCount', 20] } // Multiply count by $20 per subscription
            }
        }
    ]);
    const totalSubscriptionRevenue = subscriptionRevenueResult[0]?.totalSubscriptionRevenue || 0;

    // Revenue for the last 30 days (based on completed payments)
    const revenueLast30Days = await User.aggregate([
        {
            $match: {
                "paymentInfo.subscriptionStatus": "active", // Ensure this matches the status for completed payments
                createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: '$createdAt' },
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' }
                },
                dailyRevenue: { $sum: 20 } // Assume $20 revenue per day per subscription
            }
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1
            }
        }
    ]);

    // Return the statistics object
    return {
        postCount,
        userCount,
        verifiedUserCount,
        totalSubscriptionRevenue,
        dailyRevenue: revenueLast30Days
    };
};

export const StatisticsServices = {
    statisticsForAdmin,
};
