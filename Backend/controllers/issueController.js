import Issue from '../models/issue.js';

/**
 * @desc    Get all website & order problem issues
 * @route   GET /api/issues
 * @access  Private/Admin or Public reporting
 */
export const getIssues = async (req, res, next) => {
  try {
    const { status, priority, type, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log / Create a new problem issue ticket
 * @route   POST /api/issues
 * @access  Public or Authenticated
 */
export const createIssue = async (req, res, next) => {
  try {
    const {
      type,
      customerName,
      email,
      orderId,
      priority,
      title,
      description,
      notes,
    } = req.body;

    if (!title || !description || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide issue title, customer name, and description',
      });
    }

    // Generate unique Ticket ID: e.g. ISS-1048
    const count = await Issue.countDocuments();
    const ticketId = `ISS-${1000 + count + 1}`;

    const issue = await Issue.create({
      ticketId,
      type: type || 'Order / Shipping',
      customerName,
      email: email || '',
      orderId: orderId || 'N/A',
      priority: priority || 'Medium',
      status: 'Pending',
      title,
      description,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Issue ticket logged successfully',
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single issue by ID or TicketID
 * @route   GET /api/issues/:id
 * @access  Private/Admin
 */
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findOne({
      $or: [{ _id: req.params.id }, { ticketId: req.params.id }],
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update problem issue status & resolution notes
 * @route   PUT /api/issues/:id
 * @access  Private/Admin
 */
export const updateIssue = async (req, res, next) => {
  try {
    const { status, priority, notes } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue ticket not found',
      });
    }

    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (notes !== undefined) issue.notes = notes;

    const updatedIssue = await issue.save();

    res.status(200).json({
      success: true,
      message: 'Issue ticket updated successfully',
      issue: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or archive issue ticket
 * @route   DELETE /api/issues/:id
 * @access  Private/Admin
 */
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue ticket not found',
      });
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Issue ticket deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
