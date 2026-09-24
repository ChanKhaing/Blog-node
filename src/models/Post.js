const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [140, 'Title must be 140 characters or fewer'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    // Link each post to the user who wrote it.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

/** Short preview text used on blog cards. */
postSchema.virtual('excerpt').get(function excerpt() {
  const text = (this.content || '').replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Post || mongoose.model('Post', postSchema);
